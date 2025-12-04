import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ResumePage from "./pages/resume/resume-page";
import { NotFoundSection } from "@srf/ui";
import { ViewportProvider } from "./contexts/viewport-context";
import { imageSource } from "@mfe/shared";

export default function ResumeApp() {
  return (
    <ViewportProvider>
      <Routes>
        <Route index element={<ResumePage />} />
        <Route
          path="*"
          element={
            <NotFoundSection
              illustrationSrc={imageSource("/404.svg", "resume", {
                isDevelopment: import.meta.env.MODE === "development",
              })}
              renderLink={() => (
                <Link
                  to="/resume"
                  className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  이력서로 돌아가기
                </Link>
              )}
            />
          }
        />
      </Routes>
    </ViewportProvider>
  );
}
