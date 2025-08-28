import * as React from "react";
import type { RouteObject } from "react-router-dom";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PortfolioCreate from "./pages/Create";

export const routes: RouteObject = {
  children: [
    { index: true, element: <Home /> },
    { path: "projects", element: <Projects /> },
    { path: "project/:slug", element: <ProjectDetail /> },
    { path: "create", element: <PortfolioCreate /> },
  ],
};

export default routes;
