export function toUniqueWithOrder<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  return arr.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}
