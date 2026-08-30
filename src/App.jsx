import { createBrowserRouter, RouterProvider } from "react-router";

import {
  loader as productsLoader,
  productLoader,
} from "./features/products/ProductsLoader";

import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import { Analytics } from "@vercel/analytics/react";

// Route-level code splitting: each page's component (and, where it lives in
// the same file, its loader/action) loads in its own chunk on first
// navigation to that route, instead of everything sitting in one bundle.
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        lazy: () =>
          import("./ui/MainPageContent").then((m) => ({
            Component: m.default,
          })),
        loader: productsLoader,
        errorElement: <Error />,
      },
      {
        path: "/products",
        lazy: () =>
          import("./features/products/ProductsPage").then((m) => ({
            Component: m.default,
          })),
        loader: productsLoader,
        errorElement: <Error />,
      },
      {
        path: "/products/:sku",
        lazy: () =>
          import("./features/products/ProductPage").then((m) => ({
            Component: m.default,
          })),
        loader: productLoader,
        errorElement: <Error />,
      },
      {
        path: "/cart",
        lazy: () =>
          import("./features/cart/Cart").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "/wishlist",
        lazy: () =>
          import("./features/wishlist/Wishlist").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "/contact",
        lazy: () =>
          import("./ui/Contact").then((m) => ({ Component: m.default })),
      },
      {
        path: "/order/newOrder",
        lazy: () =>
          import("./features/order/CreateOrder").then((m) => ({
            Component: m.default,
            action: m.action,
          })),
      },
      {
        path: "/order/:orderId",
        errorElement: <Error />,
        lazy: async () => {
          const [orderConfirmation, updateOrder] = await Promise.all([
            import("./features/order/OrderConfirmation"),
            import("./features/order/UpdateOrder"),
          ]);
          return {
            Component: orderConfirmation.default,
            loader: orderConfirmation.loader,
            action: updateOrder.action,
          };
        },
      },
      {
        path: "/profile",
        lazy: () =>
          import("./features/users/UserProfile").then((m) => ({
            Component: m.default,
          })),
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  );
};

export default App;
