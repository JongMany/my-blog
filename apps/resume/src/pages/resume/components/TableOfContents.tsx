import React from "react";
import { TableOfContents as LayoutTableOfContents } from "../../../components/table-of-contents";
import { TOC_ITEMS } from "../constants/toc";

export function TableOfContents() {
  return (
    <aside className="hidden lg:block lg:col-span-2">
      <div className="lg:sticky lg:top-24">
        <LayoutTableOfContents items={TOC_ITEMS} />
      </div>
    </aside>
  );
}
