/**
 * Return the signed summation from 1 to n.
 *
 * Examples:
 * - sum_to_n(5) = 1 + 2 + 3 + 4 + 5 = 15
 * - sum_to_n(0) = 0
 * - sum_to_n(-5) = -1 + -2 + -3 + -4 + -5 = -15
 */

function assertInteger(n: number): void {
  if (!Number.isInteger(n)) {
    throw new TypeError(`n must be an integer. Received: ${n}`);
  }
}

/**
 * Implementation A: direct iterative accumulation.
 *
 * Efficiency:
 * - Time: O(|n|)
 * - Space: O(1)
 *
 * This is straightforward and easy to read, but it performs one addition per
 * integer between 1 and n, so it is slower for large inputs.
 */
export function sum_to_n_a(n: number): number {
  assertInteger(n);

  let sum = 0;
  const step = n < 0 ? -1 : 1;

  for (let current = step; n < 0 ? current >= n : current <= n; current += step) {
    sum += current;
  }

  return sum;
}

/**
 * Implementation B: arithmetic-series formula.
 *
 * Efficiency:
 * - Time: O(1)
 * - Space: O(1)
 *
 * This is the most efficient implementation. The parity branch divides before
 * multiplying, which keeps the intermediate value within the same safe range as
 * the final result under the problem's Number.MAX_SAFE_INTEGER assumption.
 */
export function sum_to_n_b(n: number): number {
  assertInteger(n);

  const sign = n < 0 ? -1 : 1;
  const magnitude = Math.abs(n);
  const unsignedSum =
    magnitude % 2 === 0
      ? (magnitude / 2) * (magnitude + 1)
      : magnitude * ((magnitude + 1) / 2);

  return sign * unsignedSum;
}

/**
 * Implementation C: divide-and-conquer recursion.
 *
 * Efficiency:
 * - Time: O(|n|)
 * - Space: O(log |n|)
 *
 * This recursively splits the summation range in half. It still visits each
 * term, but its call-stack depth grows logarithmically instead of linearly.
 */
export function sum_to_n_c(n: number): number {
  assertInteger(n);

  const sign = n < 0 ? -1 : 1;
  const magnitude = Math.abs(n);

  return sign * sumRange(1, magnitude);
}

function sumRange(start: number, end: number): number {
  if (start > end) return 0;
  if (start === end) return start;

  const midpoint = Math.floor((start + end) / 2);

  return sumRange(start, midpoint) + sumRange(midpoint + 1, end);
}
