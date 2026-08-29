import {
  getProductById,
  getProducts,
  getProductsByCategory,
} from "../../services/apiProducts";

export async function loader() {
  const products = await getProducts();
  return products;
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
