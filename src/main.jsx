import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import TicTacToePage from "./pages/ticTacToe";
import ProductsPage from "./pages/products";
import Invoice from "./pages/invoice";
import Coba from "./pages/coba";
import { Provider } from "react-redux";
import { store } from "./app/store";

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
  {
    path: "/coba",
    element: <Coba />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
