export const HEADING_STYLES = {
  h1: "text-3xl font-bold mb-6 mt-8 first:mt-0 text-gray-900 dark:text-gray-100",
  h2: "text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100",
  h3: "text-xl font-medium mb-3 mt-6 text-gray-900 dark:text-gray-100",
  h4: "text-lg font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100",
  h5: "text-base font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100",
  h6: "text-sm font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100",
} as const;

export const CODE_BLOCK_STYLES = {
  prettyCode: "overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 mb-4 my-6 shadow-lg",
  default:
    "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 my-6 shadow-md",
} as const;

export const CODE_INLINE_STYLE =
  "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100";

export const CODE_BLOCK_STYLE =
  "block text-sm font-mono leading-relaxed text-gray-100";


