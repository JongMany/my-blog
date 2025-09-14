/**
 * Semantic Typography Tokens
 * Hierarchical text styles for consistent typography
 */

/**
 * Display Typography
 * - Largest text for hero sections and major headings
 */
export const displayTypography = {
  "text-display-lg": {
    fontSize: "font-size-5xl",
    lineHeight: "line-height-tight",
    fontWeight: "font-weight-bold",
  },
  "text-display-md": {
    fontSize: "font-size-4xl",
    lineHeight: "line-height-tight",
    fontWeight: "font-weight-bold",
  },
  "text-display-sm": {
    fontSize: "font-size-3xl",
    lineHeight: "line-height-snug",
    fontWeight: "font-weight-semibold",
  },
} as const;

/**
 * Heading Typography
 * - Section headings and subheadings
 */
export const headingTypography = {
  "text-heading-lg": {
    fontSize: "font-size-2xl",
    lineHeight: "line-height-snug",
    fontWeight: "font-weight-semibold",
  },
  "text-heading-md": {
    fontSize: "font-size-xl",
    lineHeight: "line-height-normal",
    fontWeight: "font-weight-medium",
  },
  "text-heading-sm": {
    fontSize: "font-size-lg",
    lineHeight: "line-height-normal",
    fontWeight: "font-weight-medium",
  },
} as const;

/**
 * Body Typography
 * - Main content text
 */
export const bodyTypography = {
  "text-body-lg": {
    fontSize: "font-size-lg",
    lineHeight: "line-height-relaxed",
    fontWeight: "font-weight-normal",
  },
  "text-body-md": {
    fontSize: "font-size-base",
    lineHeight: "line-height-normal",
    fontWeight: "font-weight-normal",
  },
  "text-body-sm": {
    fontSize: "font-size-sm",
    lineHeight: "line-height-normal",
    fontWeight: "font-weight-normal",
  },
} as const;

/**
 * Label Typography
 * - Labels, captions, and small text
 */
export const labelTypography = {
  "text-label-lg": {
    fontSize: "font-size-sm",
    lineHeight: "line-height-tight",
    fontWeight: "font-weight-medium",
  },
  "text-label-md": {
    fontSize: "font-size-xs",
    lineHeight: "line-height-tight",
    fontWeight: "font-weight-medium",
  },
  "text-label-sm": {
    fontSize: "font-size-xs",
    lineHeight: "line-height-none",
    fontWeight: "font-weight-normal",
  },
} as const;

/**
 * All semantic typography tokens combined
 */
export const semanticTypography = {
  ...displayTypography,
  ...headingTypography,
  ...bodyTypography,
  ...labelTypography,
} as const;
