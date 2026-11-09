import {
  getProductById,
  getProducts,
  getProductsByCategory,
} from "../../services/apiProducts";
import { normalizeSort } from "./sortOptions";

// Reads the Shop's URL filters so the first paint of
// /products?category=tops&sort=price_asc is already filtered and sorted
// (previously it rendered the full catalog, then refetched). On "/" there
// are no params, so this is the plain catalog. ?q= is a client-side filter
// in ProductsPage and isn't applied here.
export async function loader({ request }) {
  const params = new URL(request.url).searchParams;
  return getProducts({
    category: params.get("category"),
    sort: normalizeSort(params.get("sort")),
    minPrice: params.get("minPrice"),
    maxPrice: params.get("maxPrice"),
  });
}

export async function productLoader({ params }) {
  const product = await getProductById(params.sku);
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  // Fetch one extra so there's still a full page of results after the
  // current product (which is always in its own category) gets filtered out.
  const categoryProducts = await getProductsByCategory(
    product.category,
  );
  const relatedProducts = categoryProducts.filter((p) => p.sku !== product.sku);

  return { product, relatedProducts };
}
