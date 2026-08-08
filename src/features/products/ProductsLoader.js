import { getProductById, getProducts } from "../../services/apiProducts";

export async function loader() {
  const products = await getProducts();
  return products;
}

export async function productLoader({ params }) {
  const product = await getProductById(params.sku);
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  return product;
}