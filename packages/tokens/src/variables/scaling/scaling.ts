export type ScalingValue = "90%" | "95%" | "100%" | "105%" | "110%";

export const scalingMap: Record<ScalingValue, number> = {
  "90%": 0.9,
  "95%": 0.95,
  "100%": 1,
  "105%": 1.05,
  "110%": 1.1,
};

/**
 * .jds-themes {
  &:where([data-scaling='90%']) {
    --scaling: 0.9;
  }
  &:where([data-scaling='95%']) {
    --scaling: 0.95;
  }
  &:where([data-scaling='100%']) {
    --scaling: 1;
  }
  &:where([data-scaling='105%']) {
    --scaling: 1.05;
  }
  &:where([data-scaling='110%']) {
    --scaling: 1.1;
  }
}
 */
