import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import TicTacToePage from "./pages/ticTacToe";
import ProductsPage from "./pages/products";
import Invoice from "./pages/invoice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Invoice />,
  },
  {
    path: "/tictactoe",
    element: <TicTacToePage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
