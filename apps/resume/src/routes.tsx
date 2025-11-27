import * as React from "react";
import type { RouteObject } from "react-router-dom";
import ResumePage from "./pages/resume/resume-page";

export const routes: RouteObject = {
  children: [{ index: true, element: <ResumePage /> }],
};

export default routes;
