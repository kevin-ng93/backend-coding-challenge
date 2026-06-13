# Problem 4: Sum to N

Provide 3 unique TypeScript implementations of `sum_to_n`.

## Behavior

The functions return the signed summation from `1` to `n`.

```ts
sum_to_n_a(5); // 15  -> 1 + 2 + 3 + 4 + 5
sum_to_n_a(0); // 0
sum_to_n_a(-5); // -15 -> -1 + -2 + -3 + -4 + -5
```

The challenge states that valid inputs always produce a result whose absolute
value is within `Number.MAX_SAFE_INTEGER`.

For negative inputs, this solution treats the summation as the negative version
of the positive range with the same magnitude. This keeps the behavior
consistent with the idea that `sum_to_n(n)` has the same sign as `n`.

## Implementations

- `sum_to_n_a`: direct iterative accumulation.
  - Time: `O(|n|)`
  - Space: `O(1)`

- `sum_to_n_b`: arithmetic-series formula.
  - Time: `O(1)`
  - Space: `O(1)`
  - Most efficient implementation.

- `sum_to_n_c`: divide-and-conquer recursion.
  - Time: `O(|n|)`
  - Space: `O(log |n|)`
  - Uses recursive range splitting, so it is mechanically different from the
    direct loop while avoiding linear call-stack growth.

## Check

```sh
npm install
npm run typecheck
npm run build
```
