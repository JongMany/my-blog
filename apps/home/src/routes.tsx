import * as React from "react";
import type { RouteObject } from "react-router-dom";
import HomePage from "./pages/HomePage";

export const routes: RouteObject = {
  children: [{ index: true, element: <HomePage /> }],
};

export default routes;
