import { expect } from 'chai';

import { quadrature } from '../../../src/integrate/quad/adaptive-quadrature';
import { integrationStep as g7k15 } from '../../../src/integrate/quad/gauss-kronrod-g7k15';

// const machineEps = Number.EPSILON;
const infty = Number.POSITIVE_INFINITY;
const minusInfty = Number.NEGATIVE_INFINITY;
const char = {
  infty: '\u221e',
  pm: '\u00b1',
  epsilon: '\uD835\uDF16',
};

const sqrt2Pi = Math.sqrt(2 * Math.PI);
const normalDistribution = (t: number) => Math.exp(-0.5 * t * t) / sqrt2Pi;

describe('Gauss-Kronrod [G7, K15]', function () {
  it('e^t [0, 1] (1 step, exact)', function () {
    const f = (t: number) => Math.exp(t);

    const [result, info] = quadrature(g7k15, f, 0, 1);

    expect(result).to.equal(1.7182818284590453);
    expect(info.steps).to.equal(1);
  });

  describe('Improper integrals', function () {
    it(`normal distribution ${char.pm}${char.infty} (32 steps, exact)`, function () {
      const f = normalDistribution;

      const [result, info] = quadrature(g7k15, f, minusInfty, infty);

      expect(result).to.equal(1);
      expect(info.steps).to.equal(32);
    });

    it(`normal distribution (-${char.infty}, 0] (16 steps, exact)`, function () {
      const f = normalDistribution;

      const [result, info] = quadrature(g7k15, f, minusInfty, 0);

      expect(result).to.equal(0.5);
      expect(info.steps).to.equal(16);
    });

    it(`normal distribution [0, ${char.infty}) (16 steps, exact)`, function () {
      const f = normalDistribution;

      const [result, info] = quadrature(g7k15, f, 0, infty);

      expect(result).to.equal(0.5);
      expect(info.steps).to.equal(16);
    });

    it(`x(e^(-x^2)) ${char.pm}${char.infty} (1 step, exact)`, function () {
      const f = (t: number) => t * Math.exp(-(t * t));

      const [result, info] = quadrature(g7k15, f, minusInfty, infty);

      expect(result).to.equal(0);
      expect(info.steps).to.equal(1);
    });

    it(`e^t (-${char.infty}, 0] (14 steps, exact)`, function () {
      const f = (t: number) => Math.exp(t);

      const [result, info] = quadrature(g7k15, f, minusInfty, 0);

      expect(result).to.equal(1);
      expect(info.steps).to.equal(14);
    });

    it(`t^-2 [1, ${char.infty}) (1 step, exact)`, function () {
      const f = (t: number) => 1 / (t * t);

      const [result, info] = quadrature(g7k15, f, 1, infty);

      expect(result).to.equal(1);
      expect(info.steps).to.equal(1);
    });
  });
});
