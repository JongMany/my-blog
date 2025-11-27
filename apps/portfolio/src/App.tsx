import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Layout, ProjectsLayout } from "./components/layout";
import HomePage from "./pages/home/home-page";
import ProjectsPage from "./pages/projects/projects-page";
import ProjectDetailPage from "./pages/project-detail/project-detail-page";

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path=":slug" element={<ProjectDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
