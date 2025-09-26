import React from "react";
import { PageTOC } from "../../../components/layout";
import { TOC_ITEMS } from "../constants/toc";

export function TableOfContents() {
  return (
    <aside className="hidden lg:block lg:col-span-2">
      <div className="lg:sticky lg:top-24">
        <PageTOC items={TOC_ITEMS} />
      </div>
    </aside>
  );
}
