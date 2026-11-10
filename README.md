# Vermera

A "quiet luxury" storefront for bags, jewellery, watches and beauty: a frontend portfolio project built with React 19, React Router 7 data routers, Redux Toolkit and Tailwind CSS 4.

**Live:** [vermera.vercel.app](https://vermera.vercel.app)

![Vermera homepage: a sunlit flatlay of a leather bag, watch and accessories beside the headline "Timeless Pieces, Thoughtfully Chosen"](public/og-image.jpg)

> Vermera is not a real store. The catalog comes from the public [DummyJSON](https://dummyjson.com) API, and the cart, wishlist, profile and orders are saved in the browser's `localStorage`. Nothing is charged and nothing ships.

## What you can do

- Browse a curated homepage ("The Edit"), shop by category, and filter by price, sort, and search.
- View product pages with an image gallery, stock status, and related pieces.
- Keep a wishlist and a cart. Quantities are capped at the available stock, and a removal can be undone from its toast.
- Check out as a guest, with standard or express shipping. Delivery is free over €500. The form is prefilled from a saved profile and can fill your address from your location.
- Look up an order by its reference and upgrade it to express delivery afterwards.

## Stack

| Area | Choice |
|---|---|
| UI | React 19, Tailwind CSS 4 (CSS-first `@theme` tokens, no config file) |
| Routing and data | React Router 7 data router: loaders for catalog and order pages, actions for checkout and order updates |
| State | Redux Toolkit (cart, wishlist, session user) |
| Motion | Framer Motion |
| Icons and fonts | lucide-react; self-hosted DM Sans and Fraunces variable fonts (Fontsource) |
| Build and hosting | Vite 7, Vercel (SPA rewrite in `vercel.json`, Vercel Analytics) |

## Decisions worth a look

- **Filters live in the URL.** Category, price range, sort and search are query parameters on `/products`. Results are shareable and reloadable, and back/forward just work. The route loader applies them before the first paint, so a filtered link never flashes the full catalog. Typing in search filters client-side and skips the loader.
- **The catalog never breaks the page.** All product data goes through `src/services/apiProducts.js`. It normalises DummyJSON into one product shape and falls back to a bundled snapshot if the API is unreachable. The snapshot is loaded with a dynamic `import()`, so it stays out of the main bundle, and the UI shows a small "saved copy of the catalog" notice when it's in use.
- **Loading states keep the layout.** A first load shows skeleton cards with the same footprint as real ones. A refetch dims the existing grid (`aria-busy`) instead of replacing it, and images fade in over a tinted box. There are no spinners for content.
- **Accessibility.** Interactive elements are real buttons and links, and a single sitewide `:focus-visible` ring marks keyboard focus. Dialogs and drawers are labelled `role="dialog"` overlays, forms have labels and inline validation, and the lookbook is a native scroll-snap carousel with slide semantics. Small text on the muted palette was adjusted to meet WCAG AA contrast.
- **One motion library.** Everything animates with Framer Motion, after an earlier GSAP layer was removed to save about 49 kB gzipped. `MotionConfig reducedMotion="user"` scales animations back for users who ask for reduced motion. The one scroll-linked parallax checks the preference itself, because `MotionConfig` doesn't cover values bound to scroll position.
- **One pricing module.** Euro formatting (`Intl.NumberFormat("en-IE")`), shipping, the €500 free-delivery threshold and tax all live in `src/utils/pricing.js`. Checkout, the saved order, the confirmation page and the profile therefore can't disagree on a total.
- **Honest content.** There are no invented reviews, ratings, urgency timers or trust badges. The homepage's service notes only claim what the store actually does.

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 7).

```bash
npm install
npm run dev       # dev server on http://localhost:5173
npm run build     # production build (also runs ESLint)
npm run preview   # serve the production build
npm run lint      # ESLint only
```

No environment variables are needed: the catalog comes from DummyJSON's public API.

## Project structure

```
src/
  features/   cart, order, products, users, wishlist: slices, pages and loaders/actions per domain
  services/   apiProducts (catalog + fallback), apiGeocoding, recentlyViewed
  ui/         layout, header/footer, homepage sections, shared components
  utils/      pricing, motion constants, localStorage keys and migration
  data/       mockProducts.json (offline catalog snapshot)
docs/
  ui-ux-audit.md   the UI/UX audit, its decisions, and the tracker this work followed
```

## Known limitations

- **No backend.** Orders, profile, cart and wishlist exist only in this browser's `localStorage`, and there is no account system or real payment step.
- **Demo data.** Products, prices, stock and discounts come from DummyJSON, which is a mock API, not real inventory.
- **Category slugs.** Some places still show raw DummyJSON slugs (for example `WOMENS-WATCHES` on product cards) instead of readable labels. This is tracked as audit item V12.
- **No automated tests.** Changes have been verified with lint, the production build, and manual browser checks.
- **Session name is in memory.** The name entered on the profile page resets on a full reload, while the saved profile details persist.
- **Address lookup.** "Get My Address" uses OpenStreetMap's Nominatim reverse geocoding, which needs location permission and is rate-limited.

## Author

Built by Haytham Saba: [GitHub](https://github.com/HaythamSaba) · [LinkedIn](https://www.linkedin.com/in/haytham-saba-401148278/) · [Website](https://haytham-saba.vercel.app/)
