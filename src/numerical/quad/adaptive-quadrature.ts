// rec-math/src/numerical/quad/adaptive-quadrature.ts

import type {
  IntegrandCallback,
  IntegrationStep,
  QuadratureInfo,
  QuadratureOptions,
} from '.';

/** Defaults for integration. */
const defaults = {
  /**
   * Target error estimate for a step: if this is smaller it can lead to
   * accumulation of roundoff errors.
   */
  epsilon: Number.EPSILON * 16,
  /**
   * Maximum depth \\( d_{max} \\)for integration: the maximum number of steps
   * can be \\( 2^{d_{max}} \\).
   * */
  maxDepth: Infinity,
};

/**
 * Perform a substitution with an appropriate change of variables to deal with
 * infinite ranges.
 *
 * @param f Integrand callback.
 * @param a Lower limit.
 * @param b Upper limit.
 * @returns An array with any necessary substitution.
 */
const changeOfVariables = (
  f: IntegrandCallback,
  a: number,
  b: number,
): [f: IntegrandCallback, a: number, b: number] => {
  if (!isFinite(b)) {
    if (!isFinite(a)) {
      // Change variables to integrate between - and + infinity.
      const _f = (t: number): number => {
        const tSquared = t * t;
        const oneOverOneMinusTSquared = 1 / (1 - tSquared);
        return (
          f(t * oneOverOneMinusTSquared) *
          (1 + tSquared) *
          oneOverOneMinusTSquared *
          oneOverOneMinusTSquared
        );
      };
      return [_f, -1, 1];
    }
    // Change variables to integrate up to infinity.
    const _f = (t: number): number => {
      const oneOverOneMinusT = 1 / (1 - t);
      return f(a + t * oneOverOneMinusT) * oneOverOneMinusT * oneOverOneMinusT;
    };
    return [_f, 0, 1];
  }

  if (!isFinite(a)) {
    // Change variables to integrate up from negative infinity.
    const _f = (t: number): number => {
      return f(b - (1 - t) / t) / (t * t);
    };
    return [_f, 0, 1];
  }
  return [f, a, b];
};

export const integrate = (
  integrationStep: IntegrationStep,
  f: IntegrandCallback,
  a: number,
  b: number,
  options: QuadratureOptions = {},
): [r: number, i: QuadratureInfo] => {
  // Establish settings.
  const settings = { ...defaults, ...options };
  const { epsilon, maxDepth } = settings;

  const info = { steps: 0, errorEstimate: 0, depth: 1 };

  // Allow for a change of variables to deal with infinite limits.
  const [_f, _a, _b] = changeOfVariables(f, a, b);

  // Get estimate so we can work out the acceptable global error.
  // Use a depth of 1 to calculate a 15 point Kronrod quadrature.
  let [result, errorEstimate] = integrate_part(
    integrationStep,
    _f, // Integrand.
    _a, // Lower limit.
    _b, // Upper limit.
    1, // New depth.
    1, // Maximum depth.
    0, // Acceptable error per unit step.
    { ...info }, // Statistics.
  );

  // Now calculate using the target global error.
  const acceptableUnitError = Math.abs((epsilon * result) / (_b - _a));
  [result, errorEstimate] = integrate_part(
    integrationStep,
    _f, // Integrand.
    _a, // Lower limit.
    _b, // Upper limit.
    1, // New depth.
    maxDepth, // Maximum depth.
    acceptableUnitError, // Acceptable error per unit step.
    info, // Statistics.
  );

  return [result, { ...info, errorEstimate }];
};

const integrate_part = (
  integrationStep: IntegrationStep,
  f: IntegrandCallback,
  a: number, // Lower limit.
  b: number, // Upper limit.
  depth: number, // New depth.
  maxDepth: number, // Maximum depth.
  acceptableUnitError: number, // Acceptable error per unit step.
  info: QuadratureInfo, // Statistics.
): [a: number, b: number] => {
  // Initialize things.
  const [currentEstimate, poorEstimate] = integrationStep(
    f, // Integrand.
    a, // Lower limit.
    b, // Upper limit.
  );

  const errorEstimate = Math.abs(poorEstimate - currentEstimate);

  if (depth >= maxDepth) {
    // Reached the maximum allowable depth so return the partial sum.
    ++info.steps;
    return [currentEstimate, errorEstimate];
  }

  const acceptableError = acceptableUnitError * (b - a);
  if (errorEstimate <= acceptableError) {
    // Error is acceptable for the size of step so return the partial sum.
    ++info.steps;
    return [currentEstimate, errorEstimate];
  }

  const mid = (a + b) / 2;
  if (a >= mid || mid >= b) {
    // We can't make this step any smaller: looks like a discontinuity.
    info.isUnreliable = true;
    const safeErrorEstimate = isNaN(errorEstimate) ? 0 : errorEstimate;
    if (isNaN(currentEstimate) || Math.abs(currentEstimate) === Infinity) {
      return [0, safeErrorEstimate];
    }
    return [currentEstimate, safeErrorEstimate];
  }

  // Recurse deeper.
  ++depth;
  if (depth > info.depth) {
    info.depth = depth;
  }
  const [leftEstimate, leftErrorEstimate] = integrate_part(
    integrationStep,
    f, // Integrand.
    a, // Lower limit.
    mid, // Upper limit.
    depth, // New depth.
    maxDepth, // Maximum depth.
    acceptableUnitError, // Acceptable error per unit step.
    info, // Statistics.
  );
  const [rightEstimate, rightErrorEstimate] = integrate_part(
    integrationStep,
    f, // Integrand.
    mid, // Lower limit.
    b, // Upper limit.
    depth, // New depth.
    maxDepth, // Maximum depth.
    acceptableUnitError, // Acceptable error per unit step.
    info, // Statistics.
  );
  return [leftEstimate + rightEstimate, leftErrorEstimate + rightErrorEstimate];
};
