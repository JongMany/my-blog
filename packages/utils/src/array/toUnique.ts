export function toUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
