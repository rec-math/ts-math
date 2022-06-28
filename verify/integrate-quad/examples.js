import * as RecMath from '../../esm/index.js';

{
  // Example 1.
  const [result, info] = RecMath.numerical.quad(
    (x) => Math.exp(-x), // A function to integrate.
    [0, Infinity], // A range to integrate over.
  );
  console.log(result); // 1
  console.log(info);
  // { steps: 14, errorEstimate: 3.384539692172424e-16, depth: 7 }
}

{
  // Example 2.
  const [result, { steps, points }] = RecMath.numerical.quad(
    // Normal distribution.
    (t) => Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI),
    [-Infinity, -3, -2, -1, 1, 2, 3, Infinity],
  );

  console.log({ result, steps }); // { result: 1, steps: 32 }

  // 68%, 96% and 99.7% confidence intervals.
  const oneSigma = points[3][0];
  const twoSigma = oneSigma + points[2][0] + points[4][0];
  const threeSigma = 1 - points[0][0] - points[6][0];

  console.log({ oneSigma, twoSigma, threeSigma });
  // {
  //   oneSigma: 0.682689492137086,
  //   twoSigma: 0.9544997361036417,
  //   threeSigma: 0.9973002039367398
  // }
}
