# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (port 5173; if occupied, Vite auto-binds the next free port such as 5174 — check the terminal output for the actual port, and never kill a dev-server PID you didn't start yourself).
- `npm run build` — production build (also runs ESLint via `vite-plugin-eslint`; treat build failures as real errors, not just lint noise).
- `npm run lint` — ESLint only (flat config in `eslint.config.js`; `.eslintrc.json` at the repo root is a stale leftover and not actually used).
- `npm run preview` — serve the production build locally.
- There is no test suite/framework configured in this repo.
- Always run `npm run lint && npm run build` after making changes, and do actual in-browser verification (not just a clean build) before reporting a UI fix as done — this repo has a history of bugs that only show up at runtime (stale closures, fake/dead interactive elements, uncontrolled inputs).

## Architecture

**Stack**: React 19 + Vite + React Router 7 (data routers: loaders/actions) + Redux Toolkit + Tailwind CSS 4 (CSS-first config, no `tailwind.config.js`).

### Data source and product shape

All product data flows through `src/services/apiProducts.js`, which fetches from `https://dummyjson.com`, scopes results to a fixed `supportedCategories` allowlist (`womens-bags`, `womens-dresses`, `womens-jewellery`, `womens-shoes`, `womens-watches`, `tops`, `skin-care`, `beauty`, `sunglasses`; defined with `CATEGORY_LABELS` in `src/features/products/categories.js` so UI like the Footer can list categories without importing the API layer), and falls back to `src/data/mockProducts.json` on any fetch/parse failure. The mock is loaded with a dynamic `import()` only when needed, so it stays out of the entry chunk — never import it statically. Every consumer gets data through this module's `getProducts()` / `getProductById()` / `getProductsByCategory()` / `getCategories()` — never fetch DummyJSON directly from a component.

All raw DummyJSON items are normalized by `transformProduct()` into the shape used throughout the UI: `{id, sku, productName, description, category, NewPrice, OldPrice, isNew, isDiscount, DiscountPercentage, image, stock, woodType, dimensions}`. `sku` (stringified) is the canonical identity used for cart keys, product URLs, React list keys, and localStorage — `id` is only a fallback list key. `isNew` is always `false` (DummyJSON has no trustworthy "new" signal) and `woodType` is always `undefined` (no DummyJSON equivalent) — both are intentional, not bugs; don't try to "fix" them by deriving fake values.

### Routing

`src/App.jsx` defines a single `createBrowserRouter` tree, all wrapped in `AppLayout` (`src/ui/AppLayout.jsx`), which renders the global `AnnouncementBar` + `Header` + `Footer` plus a thin top progress bar during `useNavigation().state === "loading"`. React Router's default behavior — the previous route stays mounted while the next route's loader runs — is relied on intentionally; don't reintroduce a full-page unmount/spinner takeover on navigation.

Routes: `/` and `/products` both use the same `productsLoader`, which returns `{ products, isFallbackCatalog }` (the flag, from `isFallbackCatalog()` in `apiProducts`, drives the "saved copy of the catalog" notice on the Shop page and The Edit) and applies the URL's `category`/`sort`/`minPrice`/`maxPrice` (so `/` gets the full catalog, and a filtered Shop link paints filtered on first render; sort values live in `src/features/products/sortOptions.js`, and unknown ones normalise to `featured`); `/products/:sku` uses `productLoader` (throws a 404 `Response` on unknown sku, caught by the root `errorElement={<Error/>}`); `/cart`, `/contact`, `/profile` have no loaders; `/order/newOrder` has a create action; `/order/:orderId` has both a loader and an update action. There is no dedicated category route — category filtering is a `?category=` query param on `/products`, read via `useSearchParams()`. Product search is the `?q=` param on the same page (client-side filter of the loaded list; the `/products` route's `shouldRevalidate` skips the loader when only `q` changes). The header search (`src/features/products/SearchModal.jsx` and the mobile inline row) is product search and lands on `/products?q=…` via `getProductSearchPath()`. Order lookup by ID is `src/features/order/OrderLookup.jsx` on `/profile` (anchor `#track-order`, linked from the footer's "Track an order").

### Products component's dual mode

`src/features/products/Products.jsx` supports two rendering modes via optional props (`products`/`setProducts`/`loading`/`setLoading`, etc.):
- **Controlled** (used by `ProductsPage.jsx` → `ProductsSection.jsx`): state lives in the parent, seeded from the router loader, so `products` is never empty during a filter/sort refetch. It only re-fetches when the filter key changes (the loader already applied the initial one), so there's no loading flash on first paint. `ProductsPage` resets `displayCount` whenever category/sort/price/search changes.
- **Uncontrolled/self-managed**: fetches its own data on mount. Currently has no caller: the homepage now shows "The Edit" (`src/ui/TheEdit.jsx`), a curated pick of up to 8 products (one in-stock piece per category, after the one pictured on that category's tile) from the `/` loader data, with a "View all" link (audit decision D9). It's kept because removing it is a separate cleanup decision.

`isControlled = productsProp !== undefined` is the switch. When touching this component, preserve both paths — the loading UI intentionally shows skeleton cards (`ProductCardSkeleton.jsx`, same footprint as `ProductItem`) only on a true first load (`loading && products.length === 0`) and otherwise keeps the stale grid visible (dimmed, `aria-busy`) during a background refetch. No spinners for content loading anywhere: image boxes use their own `bg-stone/20` tint as the placeholder and fade the image in. There is no error state: `getProducts` never throws (it falls back to the mock), so the fallback is surfaced instead via `FallbackCatalogNotice`.

### State management

Redux Toolkit store (`src/store.js`) has two slices:
- `cartSlice` (`src/features/cart/cartSlice.js`) — cart items keyed by `sku`, persisted to `localStorage["vermera_cart"]` on every mutating action. All storage keys (`vermera_cart`, `vermera_orders`, `vermera_profile`) live in `src/utils/storageKeys.js`; `src/utils/migrateStorage.js` (the first import in `main.jsx`, so it runs before the store reads storage) moves data once from the legacy `furniture_*` keys. Callers narrow products with `toCartItem()` (`sku`, `productName`, `image`, `NewPrice`, `category`, `stock`) before `addItem`, which adds `quantity`/`totalPrice`. The reducers cap every quantity at the line's `stock` (older saved lines without `stock` are uncapped). `restoreItem({ item, index })` backs the Undo on removal toasts (`showToast(message, { action })` supports `{ label, to }` and `{ label, onClick }` actions).
- `userSlice` (`src/features/users/userSlice.js`) — in-memory only (not persisted), and now holds only checkout's geocoded "Get My Address" result; a full page reload or the `navigate`/`location.reload()` browser-automation tools will reset it, so test that flow via real in-app clicks, not raw navigation. There is no `username` and no name prompt (audit decision C): `/profile` is the "Account" page (`src/features/users/UserProfile.jsx`), built only from persisted data — saved details including `name` (`localStorage["vermera_profile"]`, read via `src/features/users/profileStorage.js`) with an edit form, order history from `vermera_orders`, and `OrderLookup`. Checkout is guest checkout (audit decision D1): nothing gates `/cart` or `/order/newOrder`, and the form is prefilled from that saved profile.

### Design system

Tokens live entirely in `src/index.css` under a Tailwind v4 `@theme` block — no `tailwind.config.js`. Two palettes currently coexist:
- `--color-primary-50` through `--color-primary-950` — the original gold/bronze palette. Being phased out; check before using it, since it's being replaced component-by-component.
- The current "quiet luxury" direction: `--color-ivory`, `--color-cream`, `--color-charcoal`, `--color-espresso`, `--color-taupe`, `--color-stone`, `--color-brass`, plus `--font-serif` (Fraunces) / `--font-sans` (DM Sans, audit decision D8) and `--shadow-soft`. Both fonts are self-hosted variable fonts from Fontsource (`@fontsource-variable/fraunces/opsz.css` and `@fontsource-variable/dm-sans`, imported in `src/main.jsx`), with their two latin files preloaded in `index.html`; there is no Google Fonts connection. The UI only uses weights 400/500/600. New/restyled components should use these, not the primary-* palette. Contrast rules for the muted palette: brass fails AA as small text in either direction, so use `--color-brass-ink` when brass is the text colour on a light surface, and charcoal (not cream) text on a brass background; use `--color-error` (`text-error` / `border-error`) for error messages and invalid fields, never Tailwind's `red-*`.

Layout utilities: `.container-foundation` (responsive max-width content wrapper) and `.section` (consistent vertical rhythm) are the standard building blocks for page sections — prefer them over ad hoc padding/margin. `.template` is a legacy fixed-padding container, being phased out.

Focus states: a single sitewide `:focus-visible` rule in `src/index.css` (Tailwind `base` layer) draws a 2px espresso outline on every focusable element. Never add `outline-none` / `outline-hidden` to interactive elements — that utility outranks the base rule and removes the indicator. On dark surfaces (espresso bars, image overlays), put `.surface-dark` on the container so the ring switches to cream.

Icon library is `lucide-react` only — don't add another icon package.

Motion library is Framer Motion only (audit decision D3; GSAP was removed). Scroll entrances use `src/ui/Reveal.jsx` (single element) and `src/ui/RevealGroup.jsx` + the variants in `src/utils/motion.js` (staggered groups); the hero parallax is `src/hooks/useParallax.js`. `MotionConfig reducedMotion="user"` in `AppLayout` covers animations, but values bound through `style` (like the parallax) must check `usePrefersReducedMotion()` themselves.

### Ongoing redesign effort

This codebase is mid-migration from a generic gold-toned "Funiro furniture" template toward a "vermera" quiet-luxury women's fashion/accessories/beauty storefront. Expect to find components still on the old palette/copy alongside already-migrated ones. Established conventions from prior migration work, worth following for consistency:
- Real semantic elements over div-based fakes: `<button type="button">` (not `<div onClick>`), one real `<h1>` per page, `<nav aria-label="...">` for breadcrumbs, `role="dialog" aria-modal="true" aria-label="..."` for modal/drawer overlays, `aria-hidden="true"` on purely decorative icons, `aria-label` instead of `title` for icon-only buttons.
- Don't ship fake/dead interactive UI (buttons or affordances with no handler, decorative elements styled to look clickable) — either wire them up for real or don't style them as interactive. Known pre-existing gaps like this (e.g. `Header.jsx`'s decorative Heart icon, `Footer.jsx`'s handler-less newsletter form) are documented, intentional-for-now exceptions — don't "fix" them by fabricating fake success states or backends that don't exist; ask before scoping real functionality for them.
- Shopper-facing copy says "bag", never "cart" (round-2 decision B): button labels ("Add to Bag", "View Bag"), toasts, page titles, aria-labels, and the `ShoppingBag` icon. Code identifiers (`cartSlice`, `CartItem`, `CartIcon`…) and the `/cart` URL keep "cart".
- Don't invent data not backed by a real source: no fake review counts/ratings/testimonials, countdown/urgency messaging, or trust/payment badges — there's no reviews UI, no inventory-velocity data, and no real payment backend (checkout produces a `localStorage`-persisted order record only).

## UI/UX audit workflow

- Audit items are listed in `docs/ui-ux-audit.md`, and its section 5 records the decisions that apply to them. Work on exactly ONE item per request, the one the user names.
- Never run `git add`, `git commit`, `git push`, or any git command that changes history or the remote. The user handles all git.
- Stay in scope. List related issues under "Noticed, not fixed" instead of fixing them.
- After each change, run the build and confirm nothing new breaks or warns.
- If a fix is much bigger than the audit's effort estimate or needs a decision, stop and ask first.
- When an item changes something this file documents (like the `SearchModal` exception in V11), update CLAUDE.md in the same change.
- When done, reply with:
  - Item ID and title
  - Previous situation (with file paths)
  - Solution (with files modified)
  - Why it matters
  - How to test manually
  - A Conventional Commits message (subject max 72 chars, `Refs: audit [ID]` in the body)
  - Noticed, not fixed
