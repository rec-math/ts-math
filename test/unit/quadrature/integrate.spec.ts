import { expect } from 'chai';

import { quad } from '../../../src/integrate/quad/index.js';

describe('Quadrature unit tests', function () {
  describe('integrate.quad()', function () {
    it('should fail without a valid range', function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => quad()).to.throw(
        RangeError,
        'integration range must be an array of at least two endpoints',
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => quad(null, [1])).to.throw(
        RangeError,
        'integration range must be an array of at least two endpoints',
      );
    });

    it('should fail without a callback', function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => quad(null, [0, 1])).to.throw(
        TypeError,
        'f is not a function',
      );
    });

    it('should work forwards', function () {
      const [result] = quad((x) => x, [0, 2]);
      expect(result).to.equal(2);
    });

    it('should report the maximum depth used', function () {
      const [, { depth }] = quad((x) => x, [0, 2]);
      expect(depth).to.equal(1);
    });

    it('should work backwards', function () {
      const [result] = quad((x) => x, [2, 0]);
      expect(result).to.equal(-2);
    });

    it('should work over multiple ranges', function () {
      const [result, info] = quad((x) => x, [-2, 0, 2]);

      expect(result).to.equal(0);
      expect(info.errorEstimate).to.equal(0);
      expect(info.depth).to.equal(1);

      const pointArray = info.points || [];
      expect(pointArray[0][0]).to.equal(-2);
      expect(pointArray[1][0]).to.equal(2);
    });

    describe('options', function () {
      it('Should respect a maximum depth', function () {
        // First try without the maximum - should be exact in 2 steps.
        let [result, { depth, errorEstimate }] = quad(
          (x) => Math.sin(x),
          [0, Math.PI],
        );
        expect(result).to.equal(2);
        expect(depth).to.equal(2);
        expect(errorEstimate < 1e-15).to.be.true;

        // With one step it is still exact but the estimated error is worse.
        [result, { depth, errorEstimate }] = quad(
          (x) => Math.sin(x),
          [0, Math.PI],
          {
            maxDepth: 1,
          },
        );
        expect(depth).to.equal(1);
        expect(result).to.equal(2);
        expect(errorEstimate > 1e-12).to.be.true;
      });
    });
  });
});
