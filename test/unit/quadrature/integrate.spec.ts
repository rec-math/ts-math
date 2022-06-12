import { expect } from 'chai';

import { integrate } from '../../../src/quadrature/index.js';

describe('Quadrature unit tests', function () {
  describe('integrate()', function () {
    it('Should fail without a range', function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => integrate()).to.throw('range is not iterable');
    });

    it('Should fail without a callback', function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => integrate(null, [0, 1])).to.throw('f is not a function');
    });

    it('Should work forwards', function () {
      const [result] = integrate((x) => x, [0, 2]);
      expect(result).to.equal(2);
    });

    it('Should work backwards', function () {
      const [result] = integrate((x) => x, [2, 0]);
      expect(result).to.equal(-2);
    });
  });
});
