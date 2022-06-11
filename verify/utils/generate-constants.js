/**
 * Generate double precision constants from potentially higher precision
 * input.
 */

export const generateConstants = (source) => {
  Object.entries(source).forEach(([key, val]) => {
    // Convert to a value.
    const truncatedValue = parseFloat(val);
    // Convert the truncated value back to a string.
    const truncatedString = `${truncatedValue}`;
    // `eval` the string to test for any difference.
    const truncated = eval(truncatedString);

    // Generate code.
    const d = val - truncated;
    const diff = d === 0 ? 'exact' : `difference ${d}`;

    console.log(`//    ${key} = ${val} ${diff};`);
    console.log(`const ${key} = ${truncated};`);
  });
};
