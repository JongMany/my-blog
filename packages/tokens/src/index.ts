// ============================================================================
// Enhanced Design Token System
// Radix UI & Adobe Spectrum inspired token architecture
//
// Structure:
// 1. Primitive tokens (gray1, blue9) - base color palette
// 2. Semantic tokens (color-text-primary) - purpose-driven
// 3. Component tokens (button-background) - component-specific
// 4. Utility functions & theme management
// 5. Pre-configured token presets for easy usage
// ============================================================================

// Primitive tokens (base color scales, spacing, etc.)
export * from "./variables/colors";
export * from "./variables/scaling";
export * from "./variables/space";
export * from "./variables/radius";
export * from "./variables/typography";

// Semantic tokens (purpose-driven)
export * from "./variables/semantic";

// Component tokens (component-specific)
export * from "./variables/components/button";

// TypeScript types for type safety
export * from "./types/tokens";

// Utility functions
export * from "./utils";

// Pre-configured token presets (for convenience)
export * from "./presets";

// ============================================================================
// Main exports for easy consumption
// ============================================================================

// Re-export commonly used items for convenience
export { tokens, simpleTokens } from "./presets/common";
export { theme } from "./utils/theme";
export { getCSSToken } from "./utils/tokens";
