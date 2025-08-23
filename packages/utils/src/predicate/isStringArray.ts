export function isStringArray(arr: unknown[]): boolean {
  return arr.every((item) => typeof item === "string");
}
