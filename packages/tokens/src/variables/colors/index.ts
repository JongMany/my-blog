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

// Combine all color scales
// Note: lightColors is not exported from light.ts (it's only for type generation)
const colorScales = {
  ...black,
  ...white,
  ...dark,
  ...light,
};

export default colorScales;
