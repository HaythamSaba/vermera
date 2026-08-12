import { createBrowserRouter, RouterProvider } from "react-router";

import {
  loader as productsLoader,
  productLoader,
} from "./features/products/ProductsLoader";

import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";

import OrderConfirmation, {
  loader as orderConfirmationLoader,
} from "./features/order/OrderConfirmation";
import MainPageContent from "./ui/MainPageContent";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import UserProfile from "./features/users/UserProfile";
import ProductPage from "./features/products/ProductPage";
import { action as updateOrderAction } from "./features/order/UpdateOrder";
import Contact from "./ui/Contact";
import ProductsPage from "./features/products/ProductsPage";
import { Analytics } from "@vercel/analytics/next";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <MainPageContent />,
        loader: productsLoader,
        errorElement: <Error />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
        loader: productsLoader,
        errorElement: <Error />,
      },
      {
        path: "/products/:sku",
        element: <ProductPage />,
        loader: productLoader,
        errorElement: <Error />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/order/newOrder",
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: <OrderConfirmation />,
        errorElement: <Error />,
        loader: orderConfirmationLoader,
        action: updateOrderAction,
      },
      {
        path: "/profile",
        element: <UserProfile />,
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
