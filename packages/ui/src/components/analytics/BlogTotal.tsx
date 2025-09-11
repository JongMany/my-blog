import React from "react";
import { GaCounters } from "./GaCounter";

export function BlogTotal() {
  console.log(
    import.meta.env.VITE_GA_API_URL ??
      "https://script.google.com/macros/s/AKfycbyGtQznICkAvDQLIOh8nsKDRV1Ve9BNZGOfxndr1KzJWneeBNixQNb3L8f4ikPrbX6X/exec",
  );
  return (
    <GaCounters
      api={
        import.meta.env.VITE_GA_API_URL ??
        "https://script.google.com/macros/s/AKfycbyGtQznICkAvDQLIOh8nsKDRV1Ve9BNZGOfxndr1KzJWneeBNixQNb3L8f4ikPrbX6X/exec"
      }
      scope="prefix"
      path="/blog/"
      start="30daysAgo"
    />
  );
}
