import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PortfolioCreate from "./pages/Create";
import { RequireOwner } from "@mfe/shared";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="projects" element={<Projects />} />
      <Route path="project/:slug" element={<ProjectDetail />} />
      <Route
        path="create"
        element={
          // <RequireOwner fallback={<div>권한이 없습니다.</div>}>
          <PortfolioCreate />
          // </RequireOwner>
        }
      />
    </Routes>
  );
}

export default App;
