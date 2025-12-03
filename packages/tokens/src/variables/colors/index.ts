export * from "./black";
export * from "./white";
export * from "./dark";
export * from "./light";

// Re-export types
export type { PrimitiveColorKey } from "./light";

import * as black from "./black";
import * as white from "./white";
import * as dark from "./dark";
import * as light from "./light";

// Exclude type-only exports from colorScales
const { lightColors, ...lightColorScales } = light;

const colorScales = {
  ...black,
  ...white,
  ...dark,
  ...lightColorScales,
};

export default colorScales;
