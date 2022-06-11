import { quadrature } from './adaptive-quadrature.js';
import { integrationStep } from './gauss-kronrod-g7k15.js';

export type IntegrandCallback = (a: number) => number;

export type QuadratureInfo = {
  steps: number;
  errorEstimate?: number;
  isUnreliable?: true;
};

export type QuadratureOptions = {
  // Used to control global error.
  epsilon?: number;
  maxDepth?: number;
};

export type QuadratureRange = [a: number, b: number];

export type QuadratureSettings = {
  epsilon: number;
  maxDepth: number;
};

export type IntegrationStep = (
  f: (a: number) => number, // Integrand.
  a: number, // Lower limit.
  b: number, // Upper limit.
) => [a: number, b: number];

/**
 * The default method is adaptive quadrature with Gauss-Kronrod [G7, K15] steps.
 * @param f Callback returning value of integrand.
 * @param range
 * @param options
 * @returns
 */
export const integrate = (
  f: IntegrandCallback,
  range: QuadratureRange,
  options: QuadratureOptions,
): [r: number, i: QuadratureInfo] => {
  return quadrature(integrationStep, f, range, options);
};
