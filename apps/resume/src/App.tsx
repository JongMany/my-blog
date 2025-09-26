import { Routes, Route } from "react-router-dom";
import "./App.css";
import ResumePage from "./pages/resume/ResumePage";

export default function ResumeApp() {
  return (
    <>
      <Routes>
        <Route index element={<ResumePage />} />
      </Routes>
    </>
  );
}
