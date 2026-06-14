import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';

const implementations = [
  ['sum_to_n_a', sum_to_n_a],
  ['sum_to_n_b', sum_to_n_b],
  ['sum_to_n_c', sum_to_n_c],
] as const;

const cases: Array<[number, number]> = [
  [0, 0],
  [1, 1],
  [5, 15],
  [10, 55],
  [100, 5050],
  [-1, -1],
  [-5, -15],
  [-10, -55],
];

let assertions = 0;

for (const [name, implementation] of implementations) {
  for (const [input, expected] of cases) {
    assertions += 1;
    const actual = implementation(input);

    if (actual !== expected) {
      throw new Error(`${name}(${input}) returned ${actual}; expected ${expected}`);
    }
  }

  assertions += 1;
  let rejectedNonInteger = false;
  try {
    implementation(1.5);
  } catch {
    rejectedNonInteger = true;
  }

  if (!rejectedNonInteger) {
    throw new Error(`${name}(1.5) should reject non-integer input`);
  }
}

console.log(`All ${assertions} assertions passed.`);
