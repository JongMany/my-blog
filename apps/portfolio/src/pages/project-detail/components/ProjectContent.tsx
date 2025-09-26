import React from "react";
import { LoadingSpinner } from "../../../components/common";
import { MDXTheme } from "../../../components/mdx-theme";
import { MESSAGE_CONSTANTS } from "../constants/messages";

interface ProjectContentProps {
  MDXComponent: React.ComponentType | null;
  isLoading: boolean;
}

export function ProjectContent({
  MDXComponent,
  isLoading,
}: ProjectContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      {MDXComponent ? (
        <MDXTheme>
          <MDXComponent />
        </MDXTheme>
      ) : (
        <LoadingSpinner message={MESSAGE_CONSTANTS.MDX_RENDER_MESSAGE} />
      )}
    </div>
  );
}
