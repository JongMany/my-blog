/**
 * Checks if the given value is a number.
 *
 * This function tests whether the provided value is strictly a `number` and not `NaN`.
 * It returns `true` if the value is a valid number, and `false` otherwise.
 *
 * This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to `number`.
 *
 * @param {unknown} value - The value to test if it is a number.
 * @returns {value is number} True if the value is a number, false otherwise.
 *
 * @example
 *
 * const value1 = 42;
 * const value2 = NaN;
 * const value3 = "42";
 *
 * console.log(isNumber(value1)); // true
 * console.log(isNumber(value2)); // false
 * console.log(isNumber(value3)); // false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

