export type RadiusTokenKey = keyof typeof radiusBaseValues;
export const radiusBaseValues = {
  1: 3,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
} as const;
