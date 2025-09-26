import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="projects" element={<Projects />} />
      <Route path="project/:slug" element={<ProjectDetail />} />
    </Routes>
  );
}

export default App;
