import React from "react";
import { GaCounters } from "./GaCounter";

export function BlogTotal() {
  return (
    <GaCounters
      api={import.meta.env.VITE_GA_API_URL}
      scope="prefix"
      path="/blog/"
      start="30daysAgo"
    />
  );
}
