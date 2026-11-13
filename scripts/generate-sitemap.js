// Generates public/sitemap.xml before every build (audit V20; wired up as
// the `prebuild` npm script, so Vite copies it into dist/).
//
// URLs listed:
//   - the indexable static pages (home, Shop, Client care, About);
//   - one /products/:sku page per catalog product.
// Left out on purpose:
//   - /cart, /wishlist, /profile and /order/* are personal, browser-local
//     pages with nothing to index;
//   - ?category= views. index.html's canonical drops query strings (filtered
//     views of /products aren't separate pages), and a sitemap that lists
//     URLs whose canonical points elsewhere sends search engines mixed
//     signals.
//
// The SKUs mirror what the live site shows: the DummyJSON catalog scoped to
// supportedCategories, falling back to src/data/mockProducts.json when the
// fetch fails, the same rule as src/services/apiProducts.js. A failed fetch
// never fails the build.
//
// Per-product share cards (og:title/og:image per SKU) are a known
// limitation: link-preview scrapers don't run JS, so they'd need
// prerendering or SSR. Every route shares the site-level card in index.html.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { supportedCategories } from "../src/features/products/categories.js";

const SITE_ORIGIN = "https://vermera.vercel.app";
const CATALOG_URL = "https://dummyjson.com/products?limit=0";
const FETCH_TIMEOUT_MS = 10_000;
const STATIC_PATHS = ["/", "/products", "/contact", "/about"];

const MOCK_PATH = new URL("../src/data/mockProducts.json", import.meta.url);
const OUTPUT_PATH = new URL("../public/sitemap.xml", import.meta.url);

const toSku = (product) => String(product.sku ?? product.id);

async function fetchLiveSkus() {
  const res = await fetch(CATALOG_URL, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`DummyJSON responded ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data?.products)) {
    throw new Error("Malformed response: expected data.products array");
  }
  return data.products
    .filter((product) => supportedCategories.includes(product.category))
    .map(toSku);
}

async function readMockSkus() {
  const mock = JSON.parse(await readFile(MOCK_PATH, "utf8"));
  return mock.map(toSku);
}

async function getCatalogSkus() {
  try {
    return { skus: await fetchLiveSkus(), source: "DummyJSON catalog" };
  } catch (error) {
    console.warn(
      `[sitemap] Live catalog unavailable (${error.message}); using the mock snapshot.`,
    );
    return { skus: await readMockSkus(), source: "mock snapshot" };
  }
}

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function buildSitemap(paths) {
  const entries = paths
    .map((path) => `  <url><loc>${escapeXml(SITE_ORIGIN + path)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

async function main() {
  const { skus, source } = await getCatalogSkus();
  const productPaths = [...new Set(skus)]
    .sort()
    .map((sku) => `/products/${encodeURIComponent(sku)}`);
  const paths = [...STATIC_PATHS, ...productPaths];

  await writeFile(OUTPUT_PATH, buildSitemap(paths), "utf8");
  console.log(
    `[sitemap] Wrote ${paths.length} URLs (${productPaths.length} products from the ${source}) to ${fileURLToPath(OUTPUT_PATH)}`,
  );
}

main().catch((error) => {
  // Never block a deploy over the sitemap: report and carry on without it.
  console.error(`[sitemap] Skipped: ${error.message}`);
});
