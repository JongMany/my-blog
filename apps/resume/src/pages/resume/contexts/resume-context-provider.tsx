import React, { createContext, useContext, useState, ReactNode } from "react";

import { useResumeContent } from "../hooks";

type ResumeViewMode = "detailed" | "compact";

interface ResumeContextType {
  viewMode: ResumeViewMode;
  toggleViewMode: () => void;
  resumeContent: ReturnType<typeof useResumeContent>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeContextProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ResumeViewMode>("detailed");

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "detailed" ? "compact" : "detailed"));
  };

  const resumeContent = useResumeContent(viewMode === "detailed");

  const value = {
    viewMode,
    toggleViewMode,
    resumeContent,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
