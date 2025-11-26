import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Layout, ProjectsLayout } from "./components/layout";
import Home from "./pages/home/Home";
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/project-detail/ProjectDetail";

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<ProjectsLayout />}>
          <Route index element={<Projects />} />
          <Route path=":slug" element={<ProjectDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
