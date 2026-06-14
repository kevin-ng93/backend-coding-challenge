import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';

const implementations = [
  ['sum_to_n_a', sum_to_n_a],
  ['sum_to_n_b', sum_to_n_b],
  ['sum_to_n_c', sum_to_n_c],
] as const;

const cases: Array<[number, number]> = [
  [0, 0],
  [1, 1],
  [2, 3],
  [5, 15],
  [10, 55],
  [100, 5050],
  [100_000, 5_000_050_000],
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

const largeFormulaInput = 134_217_727;
const largeFormulaExpected = 9_007_199_187_632_128;
assertions += 1;

const largeFormulaActual = sum_to_n_b(largeFormulaInput);
if (largeFormulaActual !== largeFormulaExpected) {
  throw new Error(
    `sum_to_n_b(${largeFormulaInput}) returned ${largeFormulaActual}; expected ${largeFormulaExpected}`
  );
}

console.log(`All ${assertions} assertions passed.`);
