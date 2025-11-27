import type { RouteObject } from "react-router-dom";

import HomePage from "./pages/home/home-page";
import ProjectsPage from "./pages/projects/projects-page";
import ProjectDetailPage from "./pages/project-detail/project-detail-page";

export const routes: RouteObject = {
  children: [
    { index: true, element: <HomePage /> },
    { path: "projects", element: <ProjectsPage /> },
    { path: "project/:slug", element: <ProjectDetailPage /> },
  ],
};

export default routes;
