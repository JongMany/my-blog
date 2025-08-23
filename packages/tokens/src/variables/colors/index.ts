export * from "./black";
export * from "./white";
export * from "./dark";
export * from "./light";

import * as black from "./black";
import * as white from "./white";
import * as dark from "./dark";
import * as light from "./light";

const colorScales = {
  ...black,
  ...white,
  ...dark,
  ...light,
};

export default colorScales;
