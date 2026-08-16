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

All product data flows through `src/services/apiProducts.js`, which fetches from `https://dummyjson.com`, scopes results to a fixed `supportedCategories` allowlist (`womens-bags`, `womens-dresses`, `womens-jewellery`, `womens-shoes`, `womens-watches`, `tops`, `skin-care`, `beauty`, `sunglasses`), and falls back to `src/data/mockProducts.json` on any fetch/parse failure. Every consumer gets data through this module's `getProducts()` / `getProductById()` / `getProductsByCategory()` / `getCategories()` — never fetch DummyJSON directly from a component.

All raw DummyJSON items are normalized by `transformProduct()` into the shape used throughout the UI: `{id, sku, productName, description, category, NewPrice, OldPrice, isNew, isDiscount, DiscountPercentage, image, stock, woodType, dimensions}`. `sku` (stringified) is the canonical identity used for cart keys, product URLs, React list keys, and localStorage — `id` is only a fallback list key. `isNew` is always `false` (DummyJSON has no trustworthy "new" signal) and `woodType` is always `undefined` (no DummyJSON equivalent) — both are intentional, not bugs; don't try to "fix" them by deriving fake values.

### Routing

`src/App.jsx` defines a single `createBrowserRouter` tree, all wrapped in `AppLayout` (`src/ui/AppLayout.jsx`), which renders the global `AnnouncementBar` + `Header` + `Footer` plus a thin top progress bar during `useNavigation().state === "loading"`. React Router's default behavior — the previous route stays mounted while the next route's loader runs — is relied on intentionally; don't reintroduce a full-page unmount/spinner takeover on navigation.

Routes: `/` and `/products` both use the same `productsLoader` (full unfiltered catalog fetch); `/products/:sku` uses `productLoader` (throws a 404 `Response` on unknown sku, caught by the root `errorElement={<Error/>}`); `/cart`, `/contact`, `/profile` have no loaders; `/order/newOrder` has a create action; `/order/:orderId` has both a loader and an update action. There is no dedicated category route — category filtering is a `?category=` query param on `/products`, read via `useSearchParams()`.

### Products component's dual mode

`src/features/products/Products.jsx` supports two rendering modes via optional props (`products`/`setProducts`/`loading`/`setLoading`, etc.):
- **Controlled** (used by `ProductsPage.jsx` → `ProductsSection.jsx`): state lives in the parent, seeded from the router loader, so `products` is never empty during a filter/sort refetch.
- **Uncontrolled/self-managed** (used bare on the homepage via `MainPageContent.jsx`): fetches its own data on mount.

`isControlled = productsProp !== undefined` is the switch. When touching this component, preserve both paths — the loading UI intentionally shows a full spinner only on a true first load (`loading && products.length === 0`) and otherwise keeps the stale grid visible (dimmed, `aria-busy`) during a background refetch.

### State management

Redux Toolkit store (`src/store.js`) has two slices:
- `cartSlice` (`src/features/cart/cartSlice.js`) — cart items keyed by `sku`, persisted to `localStorage["furniture_cart"]` on every mutating action. Full product objects are spread into cart items on `addItem`, plus `quantity`/`totalPrice`.
- `userSlice` (`src/features/users/userSlice.js`) — in-memory only (not persisted); a full page reload or the `navigate`/`location.reload()` browser-automation tools will reset it, so state-dependent flows (e.g. checkout) must be tested via real in-app link/button clicks, not raw navigation.

### Design system

Tokens live entirely in `src/index.css` under a Tailwind v4 `@theme` block — no `tailwind.config.js`. Two palettes currently coexist:
- `--color-primary-50` through `--color-primary-950` — the original gold/bronze palette. Being phased out; check before using it, since it's being replaced component-by-component.
- The current "quiet luxury" direction: `--color-ivory`, `--color-cream`, `--color-charcoal`, `--color-espresso`, `--color-taupe`, `--color-stone`, `--color-brass`, plus `--font-serif` (Fraunces) / `--font-sans` (Poppins) and `--shadow-soft`. New/restyled components should use these, not the primary-* palette.

Layout utilities: `.container-foundation` (responsive max-width content wrapper) and `.section` (consistent vertical rhythm) are the standard building blocks for page sections — prefer them over ad hoc padding/margin. `.template` is a legacy fixed-padding container, being phased out.

Icon library is `lucide-react` only — don't add another icon package.

### Ongoing redesign effort

This codebase is mid-migration from a generic gold-toned "Funiro furniture" template toward a "vermera" quiet-luxury women's fashion/accessories/beauty storefront. Expect to find components still on the old palette/copy alongside already-migrated ones. Established conventions from prior migration work, worth following for consistency:
- Real semantic elements over div-based fakes: `<button type="button">` (not `<div onClick>`), one real `<h1>` per page, `<nav aria-label="...">` for breadcrumbs, `role="dialog" aria-modal="true" aria-label="..."` for modal/drawer overlays, `aria-hidden="true"` on purely decorative icons, `aria-label` instead of `title` for icon-only buttons.
- Don't ship fake/dead interactive UI (buttons or affordances with no handler, decorative elements styled to look clickable) — either wire them up for real or don't style them as interactive. Known pre-existing gaps like this (e.g. `Header.jsx`'s decorative Heart icon, `Footer.jsx`'s handler-less newsletter form, `SearchModal.jsx` being order-lookup rather than product search) are documented, intentional-for-now exceptions — don't "fix" them by fabricating fake success states or backends that don't exist; ask before scoping real functionality for them.
- Don't invent data not backed by a real source: no fake review counts/ratings/testimonials, countdown/urgency messaging, or trust/payment badges — there's no reviews UI, no inventory-velocity data, and no real payment backend (checkout produces a `localStorage`-persisted order record only).
