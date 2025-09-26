import { Routes, Route } from "react-router-dom";
import { SEO } from "@srf/ui";
import "./App.css";
import { ResumePage } from "./pages/resume";
import { ResumeProvider } from "./pages/resume/contexts/ResumeContext";

export default function ResumeApp() {
  return (
    <>
      <Routes>
        <Route index element={<ResumePage />} />
      </Routes>
    </>
  );
}
