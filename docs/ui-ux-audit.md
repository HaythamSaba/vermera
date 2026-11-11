# Vermera UI/UX audit (round 2)

_Audited 2026-11-10 against `main` (clean working tree). The first audit, with its decisions D1–D9 and the fixes that followed, is archived in [`docs/archive/ui-ux-audit-2026-11-05.md`](archive/ui-ux-audit-2026-11-05.md). Those decisions still stand unless an item below says otherwise. **IDs restart at V1 in this round.** Older commits' `Refs: audit V…` lines point at the archived audit._

This round audits the codebase as it is now, after the first round's fixes landed. Every finding cites the file it comes from. No source files were changed.

---

## 1. Stack check

What you described is right, with three additions:

| | Installed | Notes |
|---|---|---|
| React | 19.2.0 | JavaScript (`.jsx`), no TypeScript. Correct as you said. |
| Tailwind CSS | 4.1.17 | CSS-first `@theme` in `src/index.css`, no config file. |
| Framer Motion | 13.0.0 | The only animation library. There's no `gsap` in `package.json`. |
| React Router | 7.9.6 | You didn't mention it: a data router with loaders and actions in `src/App.jsx`. |
| Redux Toolkit | 2.11.0 | You didn't mention it: cart, wishlist and session-user slices (`src/store.js`). |
| Vite | 7.2.4 | ESLint runs inside the build via `vite-plugin-eslint`. |
| `react-router-dom` | 7.9.6 | **Installed but never imported** (0 imports in `src/`). In v7 it's only a re-export of `react-router`, and it's still listed in `manualChunks` (`vite.config.js`). See V11. |

## 2. Build

`npm run build` (output to the gitignored `dist/`) finished in about 10 s with **no warnings**. These are the chunks that matter:

| Chunk | Size | Gzip | Loaded |
|---|---|---|---|
| `index-*.js` (entry) | 352.7 kB | **114.2 kB** | Every page |
| `react-vendor-*.js` | 94.7 kB | 32.2 kB | Every page |
| `redux-vendor-*.js` | 27.4 kB | 10.6 kB | Every page |
| `MainPageContent-*.js` | 22.9 kB | 8.7 kB | `/` |
| `ProductsPage-*.js` | 13.0 kB | 4.9 kB | `/products` |
| `mockProducts-*.js` | 68.4 kB | 10.4 kB | Only when DummyJSON fails |
| CSS | 46.6 kB | 9.1 kB | Every page |
| Fonts (preloaded) | 37 kB + 67 kB | (woff2) | Every page |

That's about **157 kB gzipped of JS before any route chunk**. The entry chunk is the one to work on (V11).

## 3. Core shopping loop: click count

- **Landing to "added to cart": 1 click** from The Edit on the homepage, because every card has a quick-add button. Through a product page it's 2 clicks: the card, then Add to Cart.
- **Cart to completed checkout: 3 clicks plus the form.** Cart icon, then "Proceed to Checkout", then 6 required fields, then "Place Order". There's no account wall (guest checkout, D1), and standard shipping is preselected.

The loop is short. The friction isn't the number of clicks. It's how the steps *look*: a cart button on every card, a blurred banner pushing products below the fold on phones, and one product per screen on mobile (V2, V3).

---

## 4. Findings

**There are no Critical issues.** Every route works, the build is clean, and the earlier blockers (deep-link 404s, the name gate on checkout, contrast, focus states) are fixed. What's left is mostly about how premium and real the store feels, plus mobile listing ergonomics.

### High

#### V1. Raw DummyJSON slugs are still shown to shoppers
- **Problem:** The category value is rendered as-is in several places, even though `CATEGORY_LABELS` exists in `src/features/products/categories.js`:
  - The chip on every product card shows `WOMENS-WATCHES` (`src/features/products/ProductItem.jsx`, the `{category}` chip over the image).
  - Cart lines show "Womens-bags" (`src/features/cart/CartItem.jsx:49`, `capitalize`).
  - Wishlist rows do the same (`src/features/wishlist/WishlistItem.jsx`, the `{category}` line).
  - The order confirmation shows "Category: womens-bags" (`src/features/order/OrderConfirmation.jsx:152-153`).
  - The product page already maps it correctly (`ProductPage.jsx:168-170`), so the fix is to reuse that.
- **Why it matters:** It's on every card on every listing. A hiring manager sees `WOMENS-WATCHES` within seconds, and it's the clearest sign the data comes from a mock API with no presentation layer. The README already lists it as a known limitation.
- **Solution:** Add one helper and use it everywhere a category is displayed:
  ```js
  // categories.js
  export const getCategoryLabel = (slug) =>
    CATEGORY_LABELS[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  ```
  Then decide whether the card needs a category chip at all (see V3). On a filtered category page it repeats the filter on every card.
- **Effort:** S

#### V2. On mobile, the Shop shows one product per screen, below a 316px blurred banner
- **Problem:**
  - The grid is `grid-cols-1 sm:grid-cols-2 …` (`src/features/products/Products.jsx:15`, also `src/ui/TheEdit.jsx:63`). At 390px every card spans the full width, with a full-width "Add to Cart" button under each.
  - `/products` opens with `CoverBackgroundSection` (`src/ui/CoverBackgroundSection.jsx:8`): a fixed `h-[316px]` banner that downloads `products-background.webp` (**200 kB**) only to cover it with `backdrop-blur-md`, then repeats the page title and a "Home > Shop" breadcrumb.
  - Add the announcement bar, the header, the category tabs and a toolbar that wraps onto several rows, and the first product starts well below the fold on a phone.
- **Why it matters:** Most e-commerce traffic is mobile, and comparing products means seeing several at once. Two columns is the norm on phones (COS, Toteme, Aesop). The blurred "page hero" band is a pattern from the original furniture template, and it costs 200 kB for an image no one sees clearly.
- **Solution:**
  1. Use `grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 xl:grid-cols-4` on listings, with a compact card on small screens (V3 removes the bulky button).
  2. Replace the banner on Shop and Contact with a slim editorial header in the page flow: eyebrow, `<h1>` and result count. Delete `products-background.webp`.
  ```jsx
  <header className="container-foundation pt-10 pb-6">
    <p className="text-xs uppercase tracking-[0.2em] text-taupe">Shop</p>
    <h1 className="font-serif text-4xl text-espresso">{categoryLabel ?? "All pieces"}</h1>
  </header>
  ```
- **Effort:** M

#### V3. Every card carries a cart control; quick-add makes the grid read like a supermarket
- **Problem:** Each `ProductItem` renders an outline "Add to Cart" button with a cart icon, which turns into a quantity stepper plus "Remove" once the item is in the cart (`src/features/products/ProductItem.jsx:233-260`). The same full cards repeat in "You May Also Like" and "Recently Viewed" (`ProductPage.jsx`), and on The Edit. Each card also has a wishlist heart, status badges and a category chip over the image.
- **Why it matters:** Quiet-luxury listings are image, name and price: the photography does the selling, and the decision happens on the product page. A cart button and stepper on every tile looks transactional and template-like, competes with the imagery, and makes mobile tiles about 60px taller. It also lets someone add a dress without seeing its details. (DummyJSON has no sizes, see V9, but the pattern matters for how this reads in a portfolio review.)
- **Solution:** Remove the add-to-cart row from cards and keep image, name, price and the wishlist heart, with the cart stepper only in the cart. If you want to keep one-tap adding, use a quiet "Quick add" text link that appears on hover or focus on desktop only. This is a product decision: see Decision A.
- **Effort:** M

#### V4. "My Account" is a name prompt that forgets you on reload
- **Problem:**
  - `/profile` (the footer's "My Account") shows `CreateUser`, a "Welcome to Vermera / Enter your name to get started / Start Shopping" card (`src/features/users/CreateUser.jsx:25-70`) whenever `username` is empty.
  - That name lives only in Redux memory (`userSlice`), so it's gone after a reload, while the saved details on the same page persist under `vermera_profile`.
  - The profile has a `name` field that this page never shows (`UserProfile.jsx` uses `username` as the heading).
- **Why it matters:** The checkout gate was removed (D1), but its leftover is now the account page. A prompt that asks for your name and then forgets it reads like a Redux tutorial exercise, and "Start Shopping" on an account page is a dead end.
- **Solution:** Remove the name prompt. Make `/profile` an "Account" page built only from persisted data: details (including `name`) with the edit form, order history, and order lookup. Then `userSlice.username` can be retired or seeded from the saved profile. See Decision C.
- **Effort:** M

#### V5. The wishlist page breaks the palette and the removal pattern
- **Problem:**
  - "Clear Wishlist" is `MainButton variant="danger"` (`src/features/wishlist/Wishlist.jsx:38-45`): red-600 text and border, filling red on hover, with no confirmation or undo.
  - Each row's remove control is a red trash icon in a round pill (`src/features/wishlist/RemoveWishlistItem.jsx:14`, `text-red-500 … hover:bg-red-100`), also with no undo.
  - The page heading is an `<h2>`, so the page has **no `<h1>`** (`Wishlist.jsx:34`).
  - Rows get `hover:shadow-soft` although the row itself isn't clickable (`WishlistItem.jsx:36`), and each row links to the product twice (image and name).
- **Why it matters:** The only saturated red in the store sits on a page meant to feel aspirational, and it contradicts the cart, which already uses a quiet "Remove" with an Undo toast (`src/features/cart/DeleteItem.jsx`). It also goes against the rule to use `--color-error`, never Tailwind's `red-*`.
- **Solution:** Reuse the cart's quiet "Remove" text button with Undo. Make "Clear all" a small text action with Undo. Give the page an `<h1>`, drop the hover shadow, and make the image link `tabIndex={-1} aria-hidden` the way `CartItem` does. Delete the `danger` variant from `MainButton` once nothing uses it.
- **Effort:** S

### Medium

#### V6. "Bag" and "cart" are mixed
- **Problem:** The empty state says "Your bag is empty." (`src/features/cart/EmptyCart.jsx:17`). Everywhere else says cart: the "Your cart" heading (`Cart.jsx:62`), "Add to Cart" (`ProductItem.jsx`, `ProductPage.jsx`, `AddToCartButton.jsx`), "View cart" toasts, "Proceed to Checkout", and the footer's "Cart" link. The header icon is a cart too.
- **Why it matters:** Mixed vocabulary is a small but noticeable polish gap, and "bag" is the luxury convention.
- **Solution:** Pick one and apply it to labels, toasts, the page title and the icon (`ShoppingBag`). See Decision B.
- **Effort:** S

#### V7. The cart page is a narrow single column; decreasing to 0 silently removes
- **Problem:**
  - `/cart` is one `max-w-2xl` card with the totals underneath the lines (`src/features/cart/Cart.jsx:51-132`), so on desktop the summary scrolls away with a long cart.
  - "−" at quantity 1 deletes the line (`cartSlice.js:110-112`) with no Undo, unlike "Remove".
  - The stepper buttons are labelled only "Decrease quantity" and "Increase quantity" (`UpdateItemQuantity.jsx:25,37`), so with several lines a screen-reader user can't tell which product they belong to. Quantity changes aren't announced.
  - The stepper is `rounded-md` while the rest of the system is square, and line rows have a hover shadow but aren't clickable (`CartItem.jsx:19`).
- **Why it matters:** The bag is where buying decisions get made. A two-column layout with a sticky summary is the norm, and accidental removals without an undo are a classic friction point.
- **Solution:**
  - On `lg`, use two columns: lines on the left (`col-span-2`) and a `sticky top-24` summary card on the right.
  - Disable "−" at 1 (min 1), as the product page already does, and leave removal to "Remove" with Undo.
  - Label the buttons `Decrease quantity of ${productName}` and wrap the number in `aria-live="polite"`.
  - Square the stepper and drop the row hover shadow.
- **Effort:** M

#### V8. The product gallery has no swipe and small controls
- **Problem:** `src/features/products/ProductGallery.jsx` switches images with arrow buttons, thumbnails and arrow keys only. There's no touch swipe on the main image. The prev/next buttons are `w-9 h-9` (36px, below the 44px used elsewhere) as dark translucent circles on the photo, and there's no zoom or enlarged view.
- **Why it matters:** On a phone, swiping the main image is the expected gesture. Without it, shoppers either miss the other images or have to aim at small arrows.
- **Solution:** Make the main image a scroll-snap strip, as the lookbook `Carousel.jsx` already is, and sync it with the thumbnails. Make the arrows 44px, hidden on touch and shown on hover. An optional tap-to-enlarge dialog would cover zoom.
- **Effort:** M

#### V9. Fashion product pages have no size or variant selection
- **Problem:** Dresses, shoes and tops have no size selector. DummyJSON has no variant data, and `ProductPage.jsx` (`AddToCartControls`) offers only quantity.
- **Why it matters:** A dress page without sizes is the first thing a fashion-literate reviewer notices, and it makes the store feel unreal. Per the project rules, fake sizes must not be invented.
- **Solution:** Choose an honest option (see Decision D):
  - (a) Say it plainly on apparel and shoes: "One size: sizing isn't available in this demo catalog."
  - (b) Hide or limit the size-dependent categories.
  - (c) Add sizes as clearly labelled demo data in `transformProduct()`, the most realistic option but against the "no invented data" rule.
- **Effort:** S (a) to M (c)

#### V10. Search is a submit-only modal with noisy matching
- **Problem:**
  - `src/features/products/SearchModal.jsx` shows a "Search Products" heading, an input and a "Search" button, with no suggestions. You have to submit before you see anything.
  - The `/products?q=` filter matches the name, category *and the full description* (`ProductsPage.jsx:73-79`), so "bag" also returns products that only mention a bag in their text.
  - The close button is a bare 24px icon (`SearchModal.jsx`).
- **Why it matters:** Premium stores show live product results as you type, which makes search a browsing tool rather than a form.
- **Solution:** Show the top 5 matches from the cached catalog (`getProducts()` is already in memory after the first load) as image, name and price rows under the input, with a "See all results" link to `/products?q=`. Rank name matches above category above description, and give the close button 44px.
- **Effort:** M

#### V11. The entry chunk ships all of Framer Motion up front
- **Problem:** The entry chunk is 352.7 kB (114.2 kB gzipped). Framer Motion's full `motion` component is imported directly across the app shell (`AnnouncementBar`, header and drawer, `ToastContext`, `Reveal`, `RevealGroup`) and on cards, so the whole feature set loads before first paint. `react-router-dom` is an unused dependency that's still in `manualChunks` (`vite.config.js`).
- **Why it matters:** That's about 157 kB gzipped of JS before any page code, which is heavy for a mostly static editorial homepage and shows up in Lighthouse's "reduce unused JavaScript".
- **Solution:** Wrap the app in `<LazyMotion features={() => import("./motionFeatures").then(m => m.default)}>` and switch `motion.*` to `m.*`, so the small `m` component loads up front and the animation features load async. Then remove `react-router-dom` from `package.json` and `manualChunks`. Re-measure; the build already prints sizes.
- **Effort:** M

#### V12. The Contact page mixes portfolio and store
- **Problem:** `src/ui/Contact.jsx`:
  - It lists your personal Gmail as the store's contact address.
  - "Send Message" just sets `window.location.href = mailto:` with no indication that it opens your email app, and no feedback if no mail client is configured.
  - Placeholders read "John Doe" and "This field is optional" (`:64`, `:84`).
  - The section heading is an `<h3>` directly under the page `<h1>` (`:36`).
  - It uses the template cover banner from V2.
- **Why it matters:** For a store, a personal Gmail and a mailto form are signs of a demo. For a portfolio, they're fine, but only if the page says so.
- **Solution:** Pick one frame (see Decision E). Either a "Client care" page with a role address (`care@…` shown as illustrative) and a form that says "Opens your email app", or point Contact at your About page and drop the form. Either way, fix the heading level and use neutral placeholders, or none, since the labels are already visible.
- **Effort:** S

#### V13. Checkout keeps the full site chrome, and the required fields are inverted
- **Problem:**
  - `/order/newOrder` renders inside the full `AppLayout` (`src/App.jsx`): announcement bar, full navigation, search, footer and the large wordmark.
  - In `src/features/order/checkoutValidation.js`, phone is required while email is optional (`:14-23`).
- **Why it matters:** Premium checkouts remove navigation so the only way forward is completing the order. Phone-required with email-optional is the opposite of the norm, since email is the order-confirmation channel, and an unexpected required phone field is a known abandonment driver.
- **Solution:**
  - Give checkout a minimal layout (logo, a "Back to bag" link, and no footer links) by nesting it under a route with its own slim layout.
  - Swap the two rules: email required, phone optional. See Decision F.
- **Effort:** M

### Low

#### V14. Card images aren't lazy-loaded
- **Problem:** The `<img>` in `ProductItem.jsx` (around line 175) has no `loading="lazy"` or `decoding="async"`. Related, Recently Viewed and The Edit render up to 8 cards each, and their images all load eagerly.
- **Why it matters:** These are the most numerous images on the site, and most sit below the fold.
- **Solution:** Add `loading="lazy" decoding="async"` to card images. The 4:5 box already prevents layout shift. Keep eager loading only for the product page's main image, which already has `fetchPriority="high"`.
- **Effort:** S

#### V15. "Jewelry" and "jewellery" both appear
- **Problem:** The category label and lookbook say "Jewellery" (`categories.js`, `InspirationSection.jsx`), while the hero copy (`Hero.jsx:114`), meta descriptions (`index.html`, `ProductsPage.jsx:29`, `Cart.jsx:35`) and the OG description say "jewelry".
- **Why it matters:** It's a small editorial inconsistency, the kind copy-led brands don't have.
- **Solution:** Pick British spelling throughout (the store uses € and `en-IE`) and update the copy and meta strings.
- **Effort:** S

#### V16. Heading outline gaps on the homepage and in search
- **Problem:** `ServiceValues.jsx` renders three `<h3>`s with no section `<h2>`. `SearchModal` uses `SectionHeader` for its title. Contact and Wishlist are covered in V12 and V5.
- **Why it matters:** Screen-reader users navigate by headings, and gaps make the outline confusing.
- **Solution:** Give ServiceValues an `<h2 className="sr-only">Why Vermera</h2>`, or a visible eyebrow heading, and check the search dialog's heading level.
- **Effort:** S

#### V17. The homepage has two identical CTAs, and reveals on body copy
- **Problem:** The hero's "Shop the Collection" is repeated as the EditorialBanner CTA (`EditorialBanner.jsx`). `Reveal` is used 21 times, including on running paragraphs (About, InspirationSection, EditorialBanner).
- **Why it matters:** Repeated CTAs flatten the hierarchy, and fading every paragraph in reads as "animated template" rather than editorial calm.
- **Solution:** Give the banner a different destination, such as a category or the lookbook, or drop its button. Keep reveals on section headings and image groups only, and let body text simply be there.
- **Effort:** S

#### V18. Category tabs scroll sideways with no cue
- **Problem:** On phones the 10 category tabs scroll horizontally (`CategoriesList.jsx`, `overflow-x-auto`) with no edge fade or partial-tab cue, so tabs past "Watches" are easy to miss.
- **Why it matters:** Half the categories become undiscoverable on mobile.
- **Solution:** Add a right-edge gradient mask (`[mask-image:linear-gradient(to_right,black_85%,transparent)]`) while the list can scroll, and scroll the active tab into view.
- **Effort:** S

#### V19. The error page is generic
- **Problem:** `src/ui/Error.jsx` is an alert icon in a card with "Go to Home" as the only action, and the heading "Not Found" is title-cased like a system message.
- **Why it matters:** A product 404 is a common landing (old links, removed SKUs). A dead end loses the visitor.
- **Solution:** Use an editorial 404 ("This piece is no longer in the edit.") with links to Shop and the categories, and the search box.
- **Effort:** S

#### V20. No sitemap, and every route shares one share card
- **Problem:** `public/` has `robots.txt` but no `sitemap.xml`. OG tags are static in `index.html`, so every product shares the homepage card. That's a known client-side-rendering limit, documented in `index.html`.
- **Why it matters:** It has only a small effect on discoverability, but a sitemap is cheap.
- **Solution:** Generate `sitemap.xml` at build time from `supportedCategories` and the catalog SKUs (a script like `scripts/generate-share-assets.cjs`). Per-product OG cards would need prerendering or SSR; note that as a known limitation rather than build it.
- **Effort:** S

---

## 5. Decisions

_Decided 2026-11-11. These are now the requirements for the related fixes. No fixes have been started._

| # | Question | Decision | Affects |
|---|---|---|---|
| A | Keep quick-add on product cards? | **Remove quick-add from product cards entirely.** Cards show the image, name, price and the wishlist heart only. The quantity stepper exists only in the cart. | V3 |
| B | "Bag" or "cart" in the copy? | **"Bag" everywhere:** labels, toasts, page titles, aria-labels, and the `ShoppingBag` icon. | V6 |
| C | What is `/profile`? | **A persisted "Account" page:** details with the edit form, order history, and order lookup. Remove the name prompt and retire `userSlice.username`. | V4 |
| D | Sizes on apparel and shoes? | **An honest note, no invented sizes.** On apparel and shoe product pages, put the line "One size — sizing isn't available in this demo catalog." inside the Details accordion, not near the price. | V9 |
| E | Contact page frame? | **Contact becomes a "Client care" page** with delivery and returns information and **no form**. Remove the personal email address. Add one line, "Vermera is a portfolio project by Haytham Saba", linking to the About the developer page. | V12 |
| F | Required checkout fields? | **Email required, phone optional.** | V13 |

**Note on A / V3:** this intentionally reverses the always-visible card action introduced by round 1's V6 (see the [archived audit](archive/ui-ux-audit-2026-11-05.md)). That action replaced a hover-only overlay at a time when the card wasn't a real link. Now the whole card is a real link to the product page, so the extra action is no longer needed.

---

## 6. What's already working (don't touch)

- **URL-state filtering:** category, price, sort and search are all in the URL. The loader applies them before first paint, and `shouldRevalidate` skips the loader for `q`-only changes (`src/App.jsx:39-51`).
- **The data layer:** one normalising API module with a lazy-loaded mock fallback and an honest fallback notice (`apiProducts.js`, `FallbackCatalogNotice.jsx`).
- **Checkout form:** a real `<Form>` with shared client and server validation, inline errors, focus on the first invalid field, guest checkout, autofill from the saved profile, and one pricing module (`CreateOrder.jsx`, `checkoutValidation.js`, `utils/pricing.js`).
- **Cart persistence:** cart, wishlist, orders and profile survive reloads under `vermera_*` keys, with a one-time migration from the old keys (`utils/migrateStorage.js`). Quantities are capped at stock, and Remove has an Undo toast.
- **Loading states:** skeleton cards, a dimmed refetch with `aria-busy`, and tinted image placeholders. There are no content spinners.
- **Accessibility foundations:**
  - A sitewide `:focus-visible` ring, with `.surface-dark` for dark surfaces.
  - AA-tuned `taupe` and `brass-ink` tokens.
  - Focus-trapped, labelled dialogs and drawer that return focus.
  - The native `<details>` accordions and labelled forms.
- **Mobile product page:** the sticky `MobileBuyBar` appears only while the main CTA is off-screen, and it's `inert` when hidden.
- **Motion:** one library; `MotionConfig reducedMotion="user"`, a reduced-motion check on the parallax, and a global CSS reduced-motion rule. The hero copy is visible within about 200 ms.
- **Lookbook carousel:** native scroll-snap, no clones, slide semantics, and descriptive alt text.
- **Sharing and metadata:** OG and Twitter cards, a canonical URL built per route, `theme-color`, apple-touch-icon, `robots.txt`, and per-route `<title>` and meta descriptions.
- **Fonts:** self-hosted variable fonts with only the two latin files preloaded.
- **Honest content:** no invented reviews, urgency or trust badges.

---

## 7. Top 3 for a portfolio review

1. **V1, readable category labels.** It's the most visible "mock data" tell, on every card, and it's a small change.
2. **V2, mobile listing.** Two columns and no blurred template banner. This is the first screen a recruiter sees on a phone, and it would immediately look like a real store.
3. **V3, quiet product cards.** Image, name and price only. Of all the changes here, it moves the look furthest toward the quiet-luxury direction.

V4 (the account page) is a close fourth: it's the last visible remnant of the Redux-demo origins.

---

## 8. Tracker

| ID | Title | Priority | Effort | Status |
|---|---|---|---|---|
| V1 | Raw DummyJSON slugs on cards, cart, wishlist, confirmation | High | S | Open |
| V2 | Mobile listing: 1 column + 316px blurred banner (200 kB) | High | M | Open |
| V3 | Quick-add controls on every product card | High | M | Open |
| V4 | "My Account" is an in-memory name prompt | High | M | Open |
| V5 | Wishlist: red danger button and trash pills, no undo, no h1 | High | S | Open |
| V6 | "Bag" vs "cart" vocabulary | Medium | S | Open |
| V7 | Cart: single column, silent removal at 0, ambiguous stepper labels | Medium | M | Open |
| V8 | Product gallery: no swipe, 36px controls, no zoom | Medium | M | Open |
| V9 | No size or variant handling for fashion items | Medium | S–M | Open |
| V10 | Search: submit-only modal, noisy description matching | Medium | M | Open |
| V11 | Entry chunk 114 kB gz (full Framer Motion); unused react-router-dom | Medium | M | Open |
| V12 | Contact: personal Gmail, mailto-only form, heading skip | Medium | S | Open |
| V13 | Checkout: full site chrome; phone required, email optional | Medium | M | Open |
| V14 | Card images not lazy-loaded | Low | S | Open |
| V15 | "Jewelry" vs "jewellery" | Low | S | Open |
| V16 | Heading outline gaps (ServiceValues, search dialog) | Low | S | Open |
| V17 | Duplicate homepage CTA; reveals on body copy | Low | S | Open |
| V18 | Category tabs scroll sideways with no cue | Low | S | Open |
| V19 | Generic error / 404 page | Low | S | Open |
| V20 | No sitemap; one share card for all routes | Low | S | Open |
