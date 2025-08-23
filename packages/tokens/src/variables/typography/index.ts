export * from "./font-size";
export * from "./font-weight";
export * from "./line-height";
export * from "./letter-spacing";

import * as fontSize from "./font-size";
import * as fontWeight from "./font-weight";
import * as lineHeight from "./line-height";
import * as letterSpacing from "./letter-spacing";

export default {
  ...fontSize,
  ...fontWeight,
  ...lineHeight,
  ...letterSpacing,
};
