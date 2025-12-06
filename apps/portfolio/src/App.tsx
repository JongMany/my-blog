import "./App.css";
import { Route, Routes, Link } from "react-router-dom";
import { Layout, ProjectsLayout } from "./components/layout";
import HomePage from "./pages/home/home-page";
import ProjectsPage from "./pages/projects/projects-page";
import ProjectDetailPage from "./pages/project-detail/project-detail-page";
import { NotFoundSection } from "@srf/ui";
import { getImageSource } from "./utils/get-image-source";

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path=":slug" element={<ProjectDetailPage />} />
        </Route>
        <Route
          path="*"
          element={
            <NotFoundSection
              illustrationSrc={getImageSource("/404.svg")}
              renderLink={() => (
                <Link
                  to="/portfolio"
                  className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  포트폴리오로 돌아가기
                </Link>
              )}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
