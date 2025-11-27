import { Routes, Route } from "react-router-dom";
import "./App.css";
import ResumePage from "./pages/resume/resume-page";
import { ViewportProvider } from "./contexts/ViewportContext";

export default function ResumeApp() {
  return (
    <ViewportProvider>
      <Routes>
        <Route index element={<ResumePage />} />
      </Routes>
    </ViewportProvider>
  );
}
