import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import Home from "./pages/home/Home";
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/project-detail/ProjectDetail";

function App() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="project/:slug" element={<ProjectDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
