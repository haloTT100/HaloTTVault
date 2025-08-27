import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./Pages/HomePage";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        path: "",
        loader: () => {
          return window.location.replace("/home");
        },
      },
      { Component: HomePage, path: "home" },
    ],
  },
]);
