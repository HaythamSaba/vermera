# Vermera — UI/UX Audit

_Audit date: 2026-11-05 · Scope: `main` @ `7952ff6` plus the live deploy at https://vermera.vercel.app/ · Audit only: no source files were changed._

**Method:** I read every route, layout, feature, and hook under `src/` along with `index.html`, `vite.config.js`, `package.json` and `public/`. I ran `npm run build` (output to the gitignored `dist/`) and probed the live site with `curl` and Chrome. Each finding cites file paths and, where useful, line numbers. Findings marked **(verified live)** were reproduced on the production deploy, not just read from code.

---

## 0. Stack check: what differs from your description

| You said | Actual (`package.json` + `node_modules`) |
|---|---|
| React | `react` / `react-dom` **19.2.0** ✅ |
| JavaScript | ✅ JSX, no TypeScript |
| TailwindCSS | `tailwindcss` **4.1.17** via `@tailwindcss/vite` (CSS-first `@theme` in `src/index.css`, no config file) ✅ |
| Framer Motion is the only animation library; GSAP was removed | ❌ **GSAP 3.15.0 is still installed and actively used.** `src/utils/gsapSetup.js` registers `ScrollTrigger` + `SplitText`, and four hooks depend on it: `useScrollReveal`, `useStaggerReveal`, `useTextReveal` and `useParallax`. They drive every `<Reveal>`, the hero headline, the hero/footer parallax, the category grid and the service cards. Framer Motion (`framer-motion` **13.0.0**) handles the header, drawer, toasts, cart overview, product grid and buttons. Your own About page copy (`src/ui/About.jsx:182-188`) describes this split. |
| Not mentioned | React Router **7.9.6** (data routers), Redux Toolkit **2.11.0**, lucide-react **0.554.0**, Vite **7.2.4**, `@vercel/analytics`, `sharp` (dev; image script) |

**Build** (`npm run build`, exit 0, no warnings except a stale `baseline-browser-mapping` notice):

| Chunk | Raw | Gzip | Notes |
|---|---|---|---|
| `index-*.js` (entry) | 417.9 kB | 123.9 kB | Includes framer-motion **and** the 86 kB `src/data/mockProducts.json` fallback (static import in `apiProducts.js:2`) |
| `usePrefersReducedMotion-*.js` | 121.7 kB | 48.4 kB | This is **GSAP + ScrollTrigger + SplitText** (Rollup named it after a shared hook) |
| `react-vendor` | 94.6 kB | 32.2 kB | |
| `redux-vendor` | 27.4 kB | 10.6 kB | |
| CSS | 42.2 kB | 8.0 kB | |

Route chunks are small (3 to 14 kB). The JS on first load of `/` is roughly **215 kB gzipped**.

---

## 1. Core shopping loop: click counts

**Landing → "added to cart"**
- *Fastest (desktop):* scroll past the hero, category grid and lookbook → hover a card → **Add to Cart** = **1 click**, but only via a hover-only overlay (see V6).
- *Typical:* **Shop the Collection** (1) → click card info (2) → **Add to Cart** on the PDP (3) = **3 clicks**. That's fine.
- *Mobile:* touch has no hover, so there is **no visible add-to-cart on the grid**. A tap on the image can land on an invisible button (V6).

**Cart → completed checkout**
- *First visit (no "username" in Redux):* cart icon (1) → **Proceed to Checkout** (2) → silently redirected to `/profile` → type a name, **Start Shopping** (3) → dropped on **`/products`**, so the checkout intent is lost → cart icon (4) → **Proceed to Checkout** (5) → fill 5 required fields → **Place Order** (6). That's **6 clicks plus 2 forms**, with a dead end in the middle.
- *Same session, name already set:* 3 clicks plus the form.
- *After any reload:* the name is gone (in-memory slice), so you go through the gate again. In production, reloading `/cart` or `/order/newOrder` returns a **Vercel 404** (V1).

**Biggest friction points:** the 404 on refresh (V1), the name gate (V5), the hover-only card actions (V6), and totals that change between checkout and confirmation (V3).

---

## 2. Findings

### 🔴 Critical

#### V1. Every route except `/` returns 404 on direct visit or refresh in production (verified live)
- **Problem:** The repo has no `vercel.json` (or other SPA rewrite). `curl` against production gives `/` 200, while `/products`, `/products/1`, `/cart`, `/about` and `/products?category=tops` all give **404**. In-app navigation works, but refreshing, opening a shared product link, or opening a link in a new tab breaks.
- **Why it matters:** Shoppers can't share or bookmark products, and a refresh mid-checkout lands on a Vercel error page. Recruiters often open the link straight to `/products` or paste a deep link, and a 404 there is the worst first impression possible.
- **Solution:** Add `vercel.json` at the repo root:
  ```json
  { "rewrites": [{ "source": "/((?!.*\\.).*)", "destination": "/index.html" }] }
  ```
  The negative lookahead keeps real files such as `/images/*.webp` and `/favicon.svg` served normally. Unknown product URLs then reach `productLoader`'s 404 → `<Error/>` as intended.
- **Effort:** S

#### V2. The cart is not cleared after placing an order ("ghost cart")
- **Problem:** The `CreateOrder.jsx` action only calls `localStorage.removeItem("furniture_cart")` (line 195). Nothing dispatches `clearCart()`, so the Redux cart keeps every item. On the confirmation page the header badge still shows the count, `/cart` still lists the purchased items, and the **next cart mutation re-saves the stale cart** to localStorage (`cartSlice.js` saves on every action).
- **Why it matters:** After "buying", the cart is still full. This is the most visible correctness bug in the core loop, and any reviewer who completes a checkout will see it.
- **Solution:** Clear the cart in the store. The action runs outside React, so either import the store (`store.dispatch(clearCart())`) in the action, or dispatch in `OrderConfirmation` when it arrives from a fresh order (e.g. `?placed=1`). Remove the raw `localStorage.removeItem` so the slice remains the single owner of that key.
- **Effort:** S

#### V3. Shipping and totals contradict each other across the flow, and currencies are mixed
- **Problem:**
  - The checkout option says **Express +$25** (`ShippingOptions.jsx:30`). `useOrderTotals.js:10` adds it **on top of** the $15 standard rate, so the checkout total includes **$40** shipping.
  - The order action stores express as **$30** (`CreateOrder.jsx:186`), so the confirmation total is **$10 lower than what checkout showed**.
  - The confirmation page's shipping switcher (`UpdateOrder.jsx:65,108`) prices express at **$40**.
  - The announcement bar promises **"Complimentary delivery on orders over €500"** (`AnnouncementBar.jsx:7`), but no code applies it: $15 is always charged.
  - The bar uses **€**, while every price in the UI is hard-coded **`$`** via `toFixed(2)` in about 15 places.
- **Why it matters:** Totals that change after "Place Order" are a trust killer in real commerce. To a hiring manager it signals that pricing logic isn't centralized. A broken free-delivery promise is exactly the "fake claim" CLAUDE.md warns against.
- **Solution:** Create one `src/utils/pricing.js` with `SHIPPING = { standard: 15, express: 25 }`, `FREE_SHIPPING_THRESHOLD`, `TAX_RATE`, `computeTotals(subtotal, method)` and `formatPrice()` (built on `Intl.NumberFormat` with a single currency). Use it in `useOrderTotals`, the `CreateOrder` action, `OrderConfirmation`, `UpdateOrder`, `UserProfile.orderTotal`, the cart and the cards. Then either implement the threshold or change the bar's copy (decision D4/D5).
- **Effort:** M

#### V4. There are no visible keyboard focus indicators anywhere (verified live)
- **Problem:** `MainButton.jsx:48` puts `outline-none` on **every** primary/secondary/quiet/outline button. `InputField.jsx:39`, the checkout inputs (`CustomerInfo.jsx:65,93`), `CreateUser.jsx:52`, the profile inputs, the Contact textarea, the price inputs and the sort `<select>` (`ProductsSection.jsx:57`) all do the same. A repo-wide search finds **zero** `focus-visible:` styles, and the only `focus:` style is on `ProductSearch`. Live check: the focused "Shop the Collection" button computes `outline-style: none` with no box-shadow.
- **Why it matters:** Keyboard and switch users can't see where they are. This is a WCAG 2.4.7 failure and the first thing an accessibility-minded reviewer tabs through. It also undercuts the About page's claim that every control is keyboard-reachable.
- **Solution:** Add a global rule in `index.css` and drop `outline-none` from the shared components:
  ```css
  :where(a, button, input, select, textarea, [tabindex]):focus-visible {
    outline: 2px solid var(--color-espresso);
    outline-offset: 3px;
  }
  ```
  On dark surfaces (floating header, card overlay), use a `--color-cream` outline.
- **Effort:** S

#### V5. Checkout is gated behind an in-memory "enter your name" step that loses the shopper's intent
- **Problem:** `CreateOrder.jsx:67-69` redirects to `/profile` when `state.user.username` is empty. `CreateUser.jsx:16` then sends the shopper to **`/products`**, not back to checkout. The same gate sits on "View Cart" in `Products.jsx:117-120` and `CartOverview.jsx:46-49`. `userSlice` isn't persisted, so every reload resets it. Meanwhile the checkout form asks for the full name again anyway (`CustomerInfo.jsx`), and the profile's saved phone and address (`furniture_profile`) are never used to prefill it.
- **Why it matters:** This adds 3 extra clicks and a confusing detour to the most important flow. "Why do I need to type my name to view my cart?" is an obvious question for a recruiter clicking around.
- **Solution (recommended):** Remove the gate entirely and treat checkout as guest checkout. Take the name from the checkout form, and prefill name, phone and address from `furniture_profile` when present. If the profile concept stays, persist `username` and redirect back with `navigate(from ?? "/products")`. Needs decision D1.
- **Effort:** M

#### V6. Product-card actions are hover-only: invisible-but-clickable on touch, and invisible when focused by keyboard (verified live)
- **Problem:** In `ProductItem.jsx:208`, the overlay with **More Info** and **Add to Cart** uses `opacity-0 group-hover:opacity-100`. Live check: both buttons are in the DOM at opacity 0 and still clickable and focusable. On touch screens a tap on the image can hit an invisible "Add to Cart". Keyboard users tab onto invisible buttons, since there's no `group-focus-within` reveal. The card's real navigation target is a `<div role="link" tabIndex=0>` (`:245-255`), so there's no real `href`: no open-in-new-tab, no middle-click, and Space does nothing. Sold-out items can't be opened at all (`:102`).
- **Why it matters:** The product card is the most-used component in any store, and on mobile (most traffic) its primary action effectively doesn't exist. A fake link `div` also contradicts the project's own convention of real semantic elements over div-based fakes.
- **Solution:** Make the whole card a real `<Link to={`/products/${sku}`}>` (image + name + price). Show a quiet, always-visible secondary action below the price: a small text "Add to bag" or a `+` icon button that sits outside the link. Alternatively, reveal the overlay on `group-hover` **and** `group-focus-within` only at `@media (hover:hover)`, and hide it from touch. Allow sold-out products to open their PDP.
- **Effort:** M

### 🟠 High

#### V7. Lookbook carousel `srcset` points at files that don't exist, so images break (verified live)
- **Problem:** `InspirationSection.jsx:76` builds `srcSet` with `lookbook-*-480.webp 480w`, but `public/images/` only contains the 900w originals. The live `-480` URL returns **404**. Live cache-busted test: at both the mobile (240px) and desktop (404px @1.25x) slot sizes, Chrome **selects the 480w candidate and the image fails to load**. It only looks fine when the 900w file happens to be cached already.
- **Why it matters:** First-time visitors on most phones and 1x desktops see broken images in the main editorial section of the homepage.
- **Solution:** Generate the variants with your existing `scripts/optimize-images.cjs` (`sharp`) and commit `lookbook-{bags,dresses,jewellery,shoes}-480.webp`. Also change `./images/` to `/images/` so the paths don't depend on the current route.
- **Effort:** S

#### V8. The hero preload fetches the wrong image, and the real hero has no responsive sizes (verified live)
- **Problem:** `index.html:26-32` preloads `hero-bg-*.webp` (66 kB downloaded live), but `Hero.jsx:40` renders **`hero-image.webp`** (1672×941, **280 kB**, no `srcset`). The preload is wasted on every route, the LCP image isn't preloaded, and phones download the 1672px file. The hero also shows a brass spinner until the image loads (`Hero.jsx:20-24`). The `hero-bg*` files aren't referenced anywhere in `src/`.
- **Why it matters:** This hurts LCP on the most important page. A spinner over a hero image reads as "loading app", not editorial.
- **Solution:** Generate `hero-image-{640,1024,1672}.webp`. Give the `<img>` a matching `srcSet` + `sizes="100vw"`, and point the `index.html` preload at the same set. Replace the spinner with the existing `bg-stone/30` placeholder (or a tiny blurred LQIP). Delete the unused `hero-bg*` files.
- **Effort:** S

#### V9. Two animation libraries, GSAP loaded on every route, and an 86 kB mock JSON in the entry chunk
- **Problem:**
  - GSAP (48 kB gz) is pulled into **every** page because `Footer.jsx:7` lazy-loads `FooterParallaxText`, which uses `useParallax`. "Lazy" here only defers the load; it doesn't avoid it.
  - Framer Motion (in the entry chunk) and GSAP both do scroll-entrance reveals: the product grid uses Framer `useInView`, while categories and service cards use GSAP `useStaggerReveal`.
  - `apiProducts.js:2` statically imports `mockProducts.json`, and `Footer.jsx` plus the loaders import `apiProducts`, so the 86 kB fallback ships in the entry chunk even though it's only needed when DummyJSON is down.
- **Why it matters:** That's around 70 to 80 kB gz of avoidable JS on first load. Running two motion systems for the same job is the kind of thing a senior reviewer questions, and it contradicts how you described the project.
- **Solution:** (a) Pick one library (decision D3). Framer Motion's `whileInView`, `useScroll` and `useTransform` cover reveals and parallax, and the per-character headline effect can be built with a small split-into-spans helper. (b) Load the mock only on failure: `const { default: mock } = await import("../data/mockProducts.json")` inside the `catch`. (c) Move `supportedCategories` and `CATEGORY_LABELS` into a tiny constants module so the Footer doesn't import the API layer.
- **Effort:** M

#### V10. "Get My Address" geolocates but never fills the fields
- **Problem:** `ShippingAddress.jsx:46,62,72,84` passes `addressComponents` into **uncontrolled** inputs as `defaultValue`. React only reads `defaultValue` on mount. When `fetchUserAddress` resolves, the inputs are already mounted, so they stay empty and the button simply disappears (`:23`).
- **Why it matters:** A visible feature that silently does nothing is worse than no feature. CLAUDE.md lists uncontrolled inputs as a known bug class in this repo.
- **Solution:** Key the address block on the fetch result (`<div key={position.latitude}>…`) so the inputs remount with the new defaults, or make the four fields controlled. Show "Address filled from your location ✓" afterwards.
- **Effort:** S

#### V11. Header "search" is order-ID lookup; there is no product search in the global nav
- **Problem:** The search icon in the header, floating header and drawer opens `SearchModal.jsx` ("Search Your Order") and navigates to `/order/<text>`. On mobile, typing "bag" leads to "Order Not Found". Real product search exists only inline on `/products` (`ProductSearch.jsx`). This is a documented exception in CLAUDE.md, so it needs your call (D2).
- **Why it matters:** A magnifying glass in a store header universally means product search. Everyone who tries it will hit a dead end.
- **Solution:** Make the header search a product search that navigates to `/products?q=…` (and move the `searchQuery` state into the URL so results are shareable). Move order lookup to the profile page and the footer ("Track an order").
- **Effort:** M

#### V12. Raw DummyJSON slugs are shown to shoppers (verified live)
- **Problem:** Several places display raw slugs instead of labels:
  - The category chip on every card shows `WOMENS-WATCHES` (`ProductItem.jsx:202-204`).
  - "Showing womens-bags collection" (`Products.jsx:169-171`, rendered with `capitalize` as "Womens-Bags").
  - The PDP eyebrow shows "womens bags" (`ProductPage.jsx:148`).
  - Cart, order summary and confirmation show "Womens-bags" (`CartItem.jsx:24`, `SimpleCartItem.jsx:13`, `OrderConfirmation.jsx:177`).
  - The product-list meta description uses the slug (`ProductsPage.jsx:17`).
- **Why it matters:** This immediately exposes the mock API and reads like a tutorial project. `CATEGORY_LABELS` already exists and just isn't used here.
- **Solution:** Add `getCategoryLabel(slug)` in `categoryLabels.js` and use it everywhere a category is displayed.
- **Effort:** S

#### V13. Product-card styling is the loudest thing on the site
- **Problem:** In `ProductItem.jsx`:
  - An 8px white frame turns **espresso** on hover (`:164`).
  - A dark, blurred `espresso/70` overlay **covers the product image** on hover (`:208`).
  - The info panel inverts to espresso on hover (`:252`).
  - Images "pop" in from `scale: 0.8` (`:30-37`).
  - There are rounded-pill badges, including a brass "−12%" badge on almost every item, because nearly every DummyJSON product has a `discountPercentage`.
  - There's a per-image spinner, and buttons are `font-bold` + `capitalize` (`MainButton.jsx:46`).
  - On the Shop page, the category bar uses `shadow-2xl` (`CategoriesList.jsx:26`).
- **Why it matters:** Quiet-luxury references (COS, Toteme, The Row) use a flat image, a small serif or sans name, and the price, with at most a subtle image swap or underline on hover. Heavy inversions, blur overlays and percentage-off pills read as fast-fashion or template. Reviewers will see this component more than any other.
- **Solution:** Remove the frame, overlay and inversion. On hover, use a gentle `scale-[1.02]` or a second-image crossfade (DummyJSON gives `images[1]`), plus a hairline underline on the name. Show discounts as a plain struck-through price only, or not at all (D6). Use `rounded-none` for small uppercase text tags. Remove the 0.8 scale-in and replace the image spinner with the `bg-stone/20` box. Set `MainButton` to `font-medium`, `tracking-wide`, `uppercase text-xs/sm` rather than bold.
- **Effort:** M

#### V14a. No social/share metadata, touch icon or robots.txt
- **Problem:** `index.html` has a title, description and SVG favicon, but **no `og:*` / `twitter:*` tags, no `og:image`, no canonical link, no `theme-color`, no `apple-touch-icon`**. Live check: 0 OG tags, and `/og-image.jpg` and `/robots.txt` both return 404.
- **Why it matters:** The portfolio link pasted into LinkedIn, Slack or an ATS renders as a bare URL with no image.
- **Solution:** Add a 1200×630 `public/og-image.jpg` (hero crop + wordmark), the OG/Twitter tags, a canonical link, `theme-color` `#f6f3ee`, an apple-touch-icon PNG, and a simple `public/robots.txt`.
- **Effort:** S

#### V14b. README is still the Vite template _(do last)_
- **Problem:** `README.md` is the untouched "React + Vite" boilerplate.
- **Why it matters:** It's the first thing a hiring manager opens on GitHub.
- **Solution:** Rewrite it once the other fixes have landed, so it describes the finished project: a screenshot or GIF, the live link, the stack, key decisions (URL-state filters, data fallback, accessibility work, Framer-only motion, euro pricing) and known limitations.
- **Effort:** S

#### V15. Contrast failures in small text on brass, and in error text
- **Problem** (computed with WCAG formula):
  - `cream on brass` = **3.32:1**. Used for 10px cart and wishlist count badges (`CartIcon.jsx:22`, `WishlistIcon.jsx:21`) and the xs discount badge (`ProductItem.jsx:144`). Fails AA 4.5:1.
  - `text-red-500` on cream = **3.62:1** for the phone validation error (`CustomerInfo.jsx:70`) and address error (`ShippingAddress.jsx:52`). Fails.
  - Pairs that pass: `charcoal on brass` (4.88, primary button), `cream on taupe` (4.89).
- **Why it matters:** Muted palettes often fail here, and you already fixed taupe and added `brass-ink`. These are the remaining gaps.
- **Solution:** Use `bg-espresso text-cream` (or `bg-charcoal`) for count badges. Add an `--color-error` token (around `#a33a2a`, a muted brick red, which is also more on-brand) for error text and borders.
- **Effort:** S

#### V16. Mobile tap targets are 24×24 (verified at desktop; same classes on mobile)
- **Problem:** The header icon buttons and links (search, cart, menu, account, wishlist) measure **24×24 px** (`HeaderPrimary.jsx:29-47`, `HeaderFloating.jsx:37-53`, `HeaderDesktopIcons.jsx`). The cart quantity stepper buttons use `p-1` around a 16px icon, about **24px** (`UpdateItemQuantity.jsx:20,30`). The drawer close button and AnnouncementBar dismiss button are ~16 to 24px.
- **Why it matters:** WCAG 2.5.8 sets 24px as the minimum, while Apple and Material recommend 44 to 48px. Mis-taps on the cart icon or stepper are common on phones.
- **Solution:** Wrap the icons in `inline-flex items-center justify-center size-11` (44px) without changing their visual size. Give the steppers `size-10`.
- **Effort:** S

### 🟡 Medium

#### V17. Filtering, sorting and empty states on the product listing
- **Problem:** `ProductsSection.jsx`, `PriceFilterPanel.jsx`, `Products.jsx`:
  - The only filter is price, hidden in a popover, with **no min > max validation** and **no active-filter chips**. The trigger shows "Filter (1)".
  - "Clear" uses the red `danger` variant.
  - Search sits *below* the category bar and the floating cart button.
  - The no-results state ("No products match your current filters.") has **no "Clear filters" action**.
  - "Newest/Oldest" sort by DummyJSON `id`, which is meaningless to shoppers. The meta description promises sorting "by rating", which doesn't exist (`ProductsPage.jsx:17`).
  - `displayCount` isn't reset when filters change.
  - The loader (`ProductsLoader.js:7-10`) ignores the URL's `category`/`sort`/`price` params, so `/products?category=tops` briefly renders the unfiltered catalog (dimmed, with a spinner) before the controlled refetch replaces it.
  - The section heading reads "Our Products" under an h1 of "Shop".
- **Why it matters:** Comparing products quickly depends on visible, reversible filters. The current toolbar feels like a demo control panel.
- **Solution:** One toolbar row: category tabs (underline style, not boxed buttons), then "Price" and "Sort" as quiet text dropdowns, plus a result count on the right. Show active filters as removable chips with "Clear all", including in the empty state. Validate min ≤ max. Read the params in the loader (`({ request }) => new URL(request.url).searchParams`) so the first paint is correct. Rename the sort options to "Featured / Price ↑ / Price ↓ / A–Z" and remove "Oldest". Reset `displayCount` on filter change.
- **Effort:** M

#### V18. Redundant floating "Cart overview" widget on the Shop page
- **Problem:** `CartOverview.jsx` puts a second, sticky cart button inside the products section (`px-20` inside `container-foundation`, `:53`). Its popover shows "Total Quantity: / Total Price:" and routes to `/profile` without a username (`:48`). The header already has a live cart count.
- **Why it matters:** It duplicates navigation, adds another click path into the name gate, and looks like a dev widget.
- **Solution:** Remove it. If you want quick feedback after adding, replace it with a slide-in **mini-bag drawer** opened from the header cart icon and after "Add to bag", reusing the dialog, focus-trap and inert pattern from `HeaderMobileDrawer`.
- **Effort:** S (remove) / M (mini-bag)

#### V19. Cart page editing and feedback
- **Problem:** In `Cart.jsx`, `CartItem.jsx`, `DeleteItem.jsx`, `UpdateItemQuantity.jsx`:
  - Items don't link back to the PDP.
  - Quantity increase isn't capped by stock (the PDP caps it; the cart doesn't).
  - Remove is instant, with **no undo**.
  - "Clear Cart" uses `window.confirm` (`:37`) and a red danger button.
  - The trash icons are **red** pills (`DeleteItem.jsx:14`).
  - Totals show Items/Subtotal/Total with no shipping or tax preview, then $15 + 8% appear at checkout.
  - The add-to-cart toast has no "View bag" action.
  - The cart card heading is "Cart Summary, {username}" with no page `<h1>` (the h2 is the top heading).
- **Why it matters:** These are standard cart expectations. Surprise costs at checkout are a well-known abandonment driver, and red destructive styling clashes with the palette.
- **Solution:** Use a page `<h1>Your bag</h1>`, linked item images and names, the stepper capped at `stock` (store `stock` in `toCartItem`), and a quiet "Remove" text link with a toast-with-Undo. Drop "Clear cart", or replace the confirm with an inline confirm. Add a line "Shipping & tax calculated at checkout", or show the estimate from the shared `pricing.js` (V3). Add a "View bag" link in the add-to-cart toast.
- **Effort:** M

#### V20. Checkout form design and validation
- **Problem:** `CustomerInfo.jsx`, `ShippingAddress.jsx`, `ShippingOptions.jsx`, `OrderSummary.jsx`, `InputField.jsx`:
  - **No `autocomplete` attributes** (`name`, `tel`, `email`, `street-address`, `address-level2`, `postal-code`, `country-name`), so mobile autofill doesn't work.
  - Shipping is a single "Express" **checkbox** instead of a Standard/Express radio group.
  - Only the phone number is validated (server-side, in the action). Every other field relies on native `required` bubbles, with no styled inline errors.
  - Placeholder "John Doe" and a `*` asterisk with no legend.
  - The summary card uses a `border-2 border-dashed` "receipt" look (`OrderSummary.jsx:16`).
  - Every section heading has a brass lucide icon (User/MapPin/Truck/Receipt), which reads as dashboard-y.
  - The confirmation page shows "Order Confirmed!" with a 20×20 brass `CheckCircle` and 6 icon-headed cards.
- **Why it matters:** Autofill is the biggest mobile-checkout speed win. The visual language here is admin panel rather than atelier.
- **Solution:** Add `autoComplete`, `inputMode="tel"` and `enterKeyHint`. Use a `<fieldset><legend>` radio group for shipping with the price on each option. Validate on blur with styled `aria-describedby` errors on every field (focus the first invalid field on submit). Use solid hairline borders and drop most icons in favour of small uppercase eyebrows. Use the confirmation heading "Thank you, {name}." with the order number in a serif.
- **Effort:** M

#### V21. Product detail page hierarchy and mobile purchase path
- **Problem:** In `ProductPage.jsx`:
  - Raw "**99 available**" stock counts (`:195`).
  - Tag pills like `beauty`, `mascara` (`:162-173`).
  - "Brand:", "Dimensions:" and "Stock:" in bold-label form.
  - **No breadcrumb** back to the category.
  - No details/shipping accordion: shipping, warranty and returns are a brass-icon list.
  - **No sticky add-to-cart on mobile.** The CTA is below the gallery, description and tags.
  - No image zoom; the primary gallery image has no `sizes` and no `fetchpriority`.
  - "You May Also Like" and "Recently Viewed" reuse the loud card (V13).
  - Variant selection doesn't apply (DummyJSON has none), which is fine and not penalized.
- **Why it matters:** On mobile, the price and CTA scroll away. The information order should be: name, then price, then CTA, then details.
- **Solution:** Order the content as breadcrumb → category eyebrow (label) → serif name → price → short description → quantity + "Add to bag" + wishlist → `<details>` accordions ("Details" with brand and dimensions, "Shipping & returns"). Show stock only as "Low stock" or "Sold out". Drop the tag pills. Add a `fixed bottom-0` mini bar with price + "Add to bag" on `<lg` once the main CTA scrolls out (IntersectionObserver). Add `fetchpriority="high"` to the first gallery image.
- **Effort:** M

#### V22. Motion delays content in the hero and stacks up on the grid
- **Problem:**
  - The hero `<h1>` uses a per-character blur-up (`Hero.jsx:16`, `useTextReveal` stagger 40ms over ~37 chars + 800ms), so the headline needs about **2.3 s** to settle. The CTA is delayed `STAGGER_MS*8` = 960ms + 800ms (`Hero.jsx:80`).
  - The image fades in after a spinner.
  - The product grid layers a parent stagger (120ms/card), a card rise (800ms) and an image scale-from-0.8 (600ms).
  - The parallax runs on the hero and the footer watermark.
- **Why it matters:** Quiet luxury motion should be felt, not watched. The primary CTA shouldn't wait about 1.8 s to appear, and per-letter blur reveals are a fairly common "portfolio" effect that doesn't fit the restrained direction. On the plus side, reduced-motion handling is solid (see "What's working").
- **Solution:** Reveal the headline as one block (fade + 12px rise, 600ms). Show the CTA with the text or after at most 200ms. Remove the image scale-in and keep only the card fade/rise with a stagger of 60 to 80ms, capped at the first 8 cards. Keep one subtle parallax at most.
- **Effort:** S

#### V23. Leftover template and furniture copy, plus dev-facing value props
- **Problem:**
  - `EditorialBanner.jsx:26-34` ("Objects made to belong… considered forms, warm materials… everyday living").
  - Footer tagline "Considered pieces for everyday living" (`Footer.jsx:27`, also `CreateUser.jsx:65`).
  - localStorage keys `furniture_cart`, `furniture_orders`, `furniture_profile`.
  - Nominatim User-Agent `"FurnitureStore/1.0"` (`apiGeocoding.js:7`).
  - `ServiceValues.jsx` sells "Straightforward Checkout" and "Order Lookup", which are app features rather than brand values. The cards also have a hover lift (`:48`) despite not being interactive (fake affordance), plus a nested `<section>` inside `<section>` (`:37-38`) on `bg-white`, which breaks the ivory/cream palette.
  - "Our Products" heading, and "Add some products to get started!" in the empty cart.
- **Why it matters:** Copy tone does much of the work in quiet luxury. Furniture-store remnants are the clearest tell that this started from a template.
- **Solution:** Rewrite in a calm, specific voice: "A considered edit for every day." Use the empty bag line "Your bag is empty." with a "Continue shopping" link. Replace the service cards with 3 brand-true notes (e.g. "Selected for longevity", "Delivered with care", "Returns within 30 days" only if true; otherwise only claims you can back up). Remove the hover lift and use `bg-cream`. Rename the storage keys to `vermera_*` with a one-time migration, and set the UA to `"Vermera/1.0"`.
- **Effort:** S

#### V24. Invalid or awkward markup
- **Problem:**
  - **Nested `<a>`** in the mobile drawer: `<Link to="/wishlist"><WishlistIcon/></Link>`, where `WishlistIcon` is itself a `<Link>` (`HeaderMobileDrawer.jsx:87-88`).
  - `<hr>` directly inside `<ul>` (`:74`).
  - The desktop nav `<ul>` isn't wrapped in `<nav>` (`HeaderDesktopNav.jsx`).
  - The primary and floating headers both render `<header>` landmarks with duplicate nav when scrolled.
  - Contact uses an `h3` with no `h2` (`Contact.jsx:36`).
  - The breadcrumb is `div` + text `" > "` rather than an `<ol>` with `aria-hidden` separators (`Breadcrumb.jsx:18`).
  - There's **no skip-to-content link**.
- **Why it matters:** Screen readers announce the nested links confusingly. Reviewers who run axe or Lighthouse will see these.
- **Solution:** Make `WishlistIcon` accept an `asIcon` prop that renders a `<span>`. Use `<li role="separator">` or a border on the next `<li>`. Wrap the nav in `<nav aria-label="Primary">`. Mark the floating header `aria-hidden` and `inert` while the primary header is in view, or render one header that becomes sticky. Add `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` and `id="main"` on `<main>`.
- **Effort:** S

#### V25. Lookbook carousel: mobile and accessibility
- **Problem:** `Carousel.jsx` renders children **3 times** (`:57`, so 12 images, 8 of them clones exposed to assistive tech). It has no swipe, a fixed-pixel layout via `matchMedia`, and the dot buttons at about 36px are OK. Alt text is just the look's title, e.g. "Golden Hour" (`InspirationSection.jsx:82`). The caption numbering runs 02, 03, 04, 01 (`InspirationSection.jsx:10-35`).
- **Why it matters:** Swiping is the expected gesture on phones. The duplicated images inflate the accessibility tree and image requests.
- **Solution:** Use a CSS `scroll-snap-type: x mandatory` track (native swipe, no clones) with prev/next buttons that call `scrollBy`. Mark clones `aria-hidden` if you keep them. Write descriptive alt text ("Model in a linen slip dress at golden hour") and fix the numbering order.
- **Effort:** M

#### V26. Loading and error states rely on spinners
- **Problem:**
  - A brass spinner appears on the full page (`LoadingSpinner.jsx`), every card image (`ProductItem.jsx:165`), the gallery (`ProductGallery.jsx:27`), the hero, and the grid refetch overlay (`Products.jsx:177`).
  - The error branch in `Products.jsx:130` is effectively unreachable, because `apiProducts` always falls back to mock data and nothing calls `setError`. Its "Retry" does `window.location.reload()`.
  - There's no indication when the store is showing **fallback data**.
- **Why it matters:** Skeletons that match the final layout feel calmer and faster than spinners, and a "premium" feel depends heavily on this.
- **Solution:** Use a card skeleton (`aspect-4/5 bg-stone/20` + two text bars) for the first load, and keep the dim-on-refetch (it's good). For images, use just the tinted box and fade in on load. Return `{ items, fromMock }` from `getProducts` and show a discreet "Showing a cached catalog" note when using the fallback. Remove the dead error branch or wire it up.
- **Effort:** M

#### V27. Hero sizing on mobile
- **Problem:** `Hero.jsx:19` uses `h-[calc(100vh-40px)]`. On iOS and Android, `100vh` includes the collapsing toolbar, so the CTA (`mb-30`) can sit under the browser chrome and the hero jumps as the toolbar hides. The `-40px` assumes the announcement bar is visible even after it's dismissed.
- **Solution:** Use `h-[100svh]` (or `min-h-[85svh]`) and let the flex layout absorb the bar.
- **Effort:** S

#### V33. Homepage shows the whole catalog instead of a curated edit (D9)
- **Problem:** `MainPageContent.jsx` renders `<Products />` in self-managed mode. That fetches the full catalog and shows an "Our Products" grid with "Load More" (`Products.jsx:198-213`), the same experience as `/products`, in the middle of the editorial homepage.
- **Why it matters:** Luxury homepages curate. A paginated catalog dump on the landing page reads as a template and dilutes the editorial sections around it.
- **Solution:** Replace it with a small "The Edit" section showing 4–8 products picked by a deterministic rule from real catalog data (e.g. one per category; no invented "bestseller" signals), using the redesigned card (V13) and a **"View all"** link to `/products`. Remove "Load More" and "View Cart" from the homepage. The `Products` component's uncontrolled mode may then be removable; check for other callers first.
- **Effort:** S

### 🟢 Low

#### V28. Typo in the floating header class
- **Problem:** `HeaderFloating.jsx:26` has `text-charcoall` (dead class, immediately overridden by `text-cream`).
- **Solution:** Delete it.
- **Effort:** S

#### V29. About page copy overclaims, and a debug comment remains
- **Problem:** `About.jsx:182-188` says "every interactive element is a real, keyboard-reachable control with correct ARIA rather than a styled div", while the card uses `div role="link"` (V6) and there are no focus styles (V4). It also describes the GSAP/Framer split you believed had been removed. `About.jsx:73` has a leftover `// TESTING:` comment.
- **Solution:** Update the copy once V4, V6 and V9 are settled, and remove the comment.
- **Effort:** S

#### V30. Font loading
- **Problem:** `index.html` loads **5 Poppins weights** (300 to 700) plus 3 Fraunces weights from Google Fonts. The UI mostly uses 400/500/600. It's non-blocking (good), but it adds a third-party connection and swap-induced layout shift.
- **Solution:** Trim to the weights actually used (Poppins 400/500/600, Fraunces 400/500/600). Optionally self-host the woff2 files via `@fontsource-variable/fraunces` + `@fontsource/poppins` and preload the two most-used files. Consider a quieter sans pairing (e.g. Inter or a grotesk). Poppins' geometric roundness reads more "startup" than "atelier" (decision D8).
- **Effort:** S

#### V31. Footer details
- **Problem:** `Footer.jsx:13` adds `pt-50` (200px) of space for the watermark on every page, plus a heavy `shadow-[0_-10px_30px_10px_rgba(0,0,0,0.1)]` (`:21`). The "About the Developer" link sits under "Customer Care". There's no "Track an order" link.
- **Solution:** Reduce the padding, replace the shadow with a hairline `border-t border-stone`, move the developer link into its own small "Colophon/Built by" line, and add "Track an order" (pairs with V11).
- **Effort:** S

#### V32. Profile page polish
- **Problem:** `UserProfile.jsx` uses label-less inputs in edit mode (`<p>` labels, not `<label for>`, `:143-198`), an avatar circle with a generic user icon, and an "Edit Profile" `font-bold` button.
- **Solution:** Use real `<label>` elements, a `<dl>` for the read view, and quieter buttons.
- **Effort:** S

---

## 3. What's already working (don't touch)

- **Data layer** (`src/services/apiProducts.js`): a single module, a cached catalog promise (one network request per session despite multiple callers), category scoping, clean `transformProduct` normalization, and a graceful mock fallback. Honest choices such as `isNew: false` and no fabricated ratings or reviews.
- **URL-driven state:** category, sort and price live in the query string with back/forward support (`CategoriesList`, `ProductsPage.updateParams`), and `PriceFilterPanel` re-seeds from the URL on open.
- **Routing architecture:** route-level code splitting via `lazy`, loaders with the previous page kept mounted and a slim top progress bar (`AppLayout.jsx`), and a 404 `Response` for unknown SKUs caught by the error element.
- **Reduced motion is respected per mechanism:** `MotionConfig reducedMotion="user"` covers Framer, `usePrefersReducedMotion` gates every GSAP hook (with show-immediately fallbacks), `useReducedMotion` covers the card, wishlist and count animations, and a global CSS rule covers transitions. This is better than most portfolio projects.
- **Dialog and drawer accessibility:** `role="dialog"`/`aria-modal`, focus trap, Escape to close, focus moved in on open and returned to the actual trigger on close, `inert` + `aria-hidden` during exit animations, and body scroll lock (`Header.jsx`, `HeaderMobileDrawer.jsx`, `CartOverview.jsx`, `SearchModal.jsx`).
- **Product gallery keyboard model:** a proper `tablist`/`tab`/`tabpanel` with roving tabindex, arrow, Home and End keys, and remount-by-key image state (`ProductGallery.jsx`).
- **Feedback:** a global `aria-live` toast (`ToastContext.jsx`), the inline "Added ✓" confirmation on the button (`useAddedConfirmation`), the animated header count, and the dim-but-keep-the-grid behaviour during refetch with `aria-busy`.
- **Persistence:** cart, wishlist, orders, profile and recently viewed all survive reloads. The cart payload is narrowed (`toCartItem`).
- **Design tokens:** a clean `@theme` palette with documented contrast fixes (`--color-taupe`, `--color-brass-ink`), plus the `container-foundation`/`.section` rhythm, Fraunces headings and a hand-built SVG brand mark.
- **Per-route titles and meta descriptions** (`useDocumentTitle`, `useMetaDescription`), image `aspect-*` boxes (no CLS), and `loading="lazy"` on below-the-fold images.
- **Honesty guardrails:** no fake reviews, urgency timers or payment badges. Keep it that way.

---

## 4. Top 3 changes for portfolio impact

1. **Make it impossible to break in a reviewer's hands (V1, V2, V3, V7):** add the SPA rewrite, clear the cart after an order, use one shared pricing module with a single currency, and commit the missing lookbook images. This is about half a day of work, and it removes every "this is broken" moment a recruiter could hit by refreshing, sharing a link, or completing a checkout.
2. **Redesign the product card (V6, V12, V13, plus V4 focus styles):** a real `<Link>`, a calm hover, labels instead of slugs, an always-reachable "Add to bag" on touch, and visible focus. The card appears on Home, Shop, the PDP's related products and Recently Viewed, so this one component changes how luxury the whole site feels.
3. **Frictionless checkout (V5, V10, V20, V18):** remove the name gate (guest checkout with profile prefill), fix "Get My Address", add autocomplete and radio-based shipping, and replace the floating cart widget with a mini-bag drawer. That makes the core loop "add → bag → checkout → confirmation" in 3 clicks, which is the story to tell in an interview.

_Cheap bonus with outsized recruiter value:_ **V14a** (OG image and share metadata) now, and **V14b** (a real README) last.

---

## 5. Decisions

_Decided 2026-11-05. These are now the requirements for the related fixes. No fixes have been started._

| # | Question | Decision | Affects |
|---|---|---|---|
| D1 | Keep the "enter your name" gate before cart/checkout? | **Remove it.** Guest checkout: the name comes from the checkout form, and name/phone/address are prefilled from the saved profile (`furniture_profile`) when present. | V5, V18, V20 |
| D2 | Header search: product search or order lookup? | **Product search.** The header search navigates to `/products?q=…`. Order lookup moves to the Profile page and a footer **"Track an order"** link. This replaces the documented `SearchModal` exception in CLAUDE.md. | V11, V17, V31 |
| D3 | Animation library? | **Consolidate on Framer Motion and remove GSAP entirely** (`gsap` dependency, `src/utils/gsapSetup.js` and the four GSAP hooks). **Ordering: V22 (replace the per-letter headline reveal) is done before V9.** | V22 → V9, V29 |
| D4 | Currency? | **Euro only.** Every price goes through the shared `formatPrice()`, built on `Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" })`. No hard-coded `$` or `toFixed(2)` in components. | V3 (and every price display) |
| D5 | Free-delivery threshold? | **Implement free delivery over €500** in `src/utils/pricing.js`, so the announcement bar's claim becomes true. | V3, V19 |
| D6 | Show DummyJSON discounts? | **Strike-through original price only. No percentage badges.** | V13, V15 |
| D7 | Developer page in the main nav? | **Relabel it "About the developer" and move its link to the footer.** Remove "About" from the header and drawer navigation. | V23, V31 |
| D8 | Replace Poppins? | **Yes, as the last polish item.** The replacement font is to be confirmed by you at that point; don't pick one before then. | V30 |
| D9 | Homepage product grid? | **A curated edit of 4–8 products with a "View all" link** to `/products`, instead of the full catalog with "Load More". Tracked as **V33**. | V33 |

**Ordering constraints:** V22 before V9 (D3). V14b (README) is done last, after the work it describes. V30 (font) is the last polish item and waits for your font choice.

---

## 6. Tracker

| ID | Title | Priority | Effort | Status |
|---|---|---|---|---|
| V1 | Deep links 404 on Vercel (no SPA rewrite) | Critical | S | Open |
| V2 | Cart not cleared in Redux after order | Critical | S | Open |
| V3 | Shipping/total mismatch, broken free-delivery claim, mixed €/$ | Critical | M | Open |
| V4 | No visible focus indicators (`outline-none` everywhere) | Critical | S | Open |
| V5 | Name gate before checkout loses intent; not persisted | Critical | M | Open |
| V6 | Card actions hover-only; fake `div role="link"` | Critical | M | Open |
| V7 | Lookbook `-480.webp` srcset files missing → broken images | High | S | Open |
| V8 | Hero preload targets unused image; hero not responsive | High | S | Open |
| V9 | GSAP + Framer both shipped; mock JSON in entry chunk | High | M | Open |
| V10 | "Get My Address" doesn't fill uncontrolled inputs | High | S | Open |
| V11 | Header search is order lookup, not product search | High | M | Open |
| V12 | Raw category slugs shown to shoppers | High | S | Open |
| V13 | Product card styling too loud for quiet luxury | High | M | Open |
| V14a | No OG/Twitter meta, touch icon, robots.txt | High | S | Open |
| V14b | README is Vite boilerplate _(do last)_ | High | S | Open |
| V15 | Contrast: cream-on-brass badges, red-500 errors | High | S | Open |
| V16 | 24px tap targets in header and cart steppers | High | S | Open |
| V17 | Listing filters/sort/empty state; loader ignores URL params | Medium | M | Open |
| V18 | Redundant floating CartOverview widget | Medium | S | Open |
| V19 | Cart editing, undo, stock cap, cost preview, red trash | Medium | M | Open |
| V20 | Checkout form: autocomplete, radio shipping, inline validation, styling | Medium | M | Open |
| V21 | PDP hierarchy, breadcrumb, accordions, sticky mobile CTA | Medium | M | Open |
| V22 | Hero/grid motion delays content and stacks | Medium | S | Open |
| V23 | Furniture/template copy; dev-facing value props; fake hover lift | Medium | S | Open |
| V24 | Nested `<a>`, `<hr>` in `<ul>`, no skip link, landmarks, breadcrumb | Medium | S | Open |
| V25 | Carousel clones, no swipe, weak alt text, odd numbering | Medium | M | Open |
| V26 | Spinners instead of skeletons; dead error branch; silent fallback | Medium | M | Open |
| V27 | Hero `100vh` on mobile | Medium | S | Open |
| V28 | `text-charcoall` typo | Low | S | Open |
| V29 | About copy overclaims; `TESTING:` comment | Low | S | Open |
| V30 | Font weights / self-hosting / typeface choice | Low | S | Open |
| V31 | Footer spacing, shadow, link grouping | Low | S | Open |
| V32 | Profile edit form labels and styling | Low | S | Open |
| V33 | Homepage: curated edit of 4–8 products + "View all" (D9) | Medium | S | Open |
