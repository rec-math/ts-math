// rec-math/src/numerical/quad/index.ts

import { integrate } from './adaptive-quadrature.js';
import { integrationStep } from './gauss-kronrod-g7k15.js';

export type IntegrandCallback = (a: number) => number;

export interface QuadratureInfo {
  /** Number of steps _used_ in the integration. */
  steps: number;
  /** Estimate of the global error. */
  errorEstimate: number;
  /**
   * Set to true if there was a problem (e.g. could not reach required accuracy
   * with a step at machine precision).
   */
  isUnreliable?: true;
  /**
   * If the range has multiple (i.e. more than 2) points, contains the results
   * for intermediate ranges.
   */
  points?: [r: number, i: QuadratureInfo][];
  /** The maximum depth used. */
  depth: number;
}

export interface QuadratureOptions {
  /** Used to control global error. */
  epsilon?: number;
  /** Maximum depth to use for adaptive step length. */
  maxDepth?: number;
}

export type IntegrationStep = (
  /** The integrand. */
  f: (a: number) => number,
  a: number, // Lower limit.
  b: number, // Upper limit.
) => [a: number, b: number];

const rangeErrorMessage =
  'integration range must be an array of at least two endpoints';

/**
 * Numerically compute a definite integral.
 *
 * @param f Callback returning value of integrand.
 * @param range A range of at least 2 endpoints.
 * @param options Options for the computation.
 *
 * @returns The results of the computation.
 */
export const quad = (
  f: IntegrandCallback,
  range: number[],
  options: QuadratureOptions = {},
): [r: number, i: QuadratureInfo] => {
  // Interpret the range.
  if (!Array.isArray(range)) {
    throw new RangeError(rangeErrorMessage);
  }

  if (range.length === 2) {
    // Integrate over a single range.
    const [a, b] = range;
    return integrate(integrationStep, f, a, b, options);
  }

  if (range.length < 2) {
    // Can't integrate at a point!
    throw new RangeError(rangeErrorMessage);
  }

  // Integrate over multiple ranges.
  let result = 0;
  const points: [r: number, i: QuadratureInfo][] = [];
  const info = {
    steps: 0,
    errorEstimate: 0,
    points,
    depth: 0,
  };

  for (let i = 0; i < range.length - 1; ++i) {
    const single = integrate(
      integrationStep,
      f,
      range[i],
      range[i + 1],
      options,
    );

    info.points.push(single);
    // Update the result.
    result += single[0];
    // Update the cumulative statistics.
    info.steps += single[1].steps;
    info.errorEstimate += single[1].errorEstimate;
    info.depth = Math.max(info.depth, single[1].depth);
  }

  return [result, info];
};
