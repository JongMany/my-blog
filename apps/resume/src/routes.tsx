import * as React from "react";
import type { RouteObject } from "react-router-dom";
import ResumePage from "./pages/ResumePage";

export const routes: RouteObject = {
  children: [{ index: true, element: <ResumePage /> }],
};

export default routes;
