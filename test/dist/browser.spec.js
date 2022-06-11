import { readFileSync } from 'fs';

import { expect } from 'chai';

import pkg from '../../package.json';

const iife = readFileSync(pkg.browser, 'utf8');
const RecMath = eval(`(() => { ${iife}; return RecMath })()`);

describe('The browser bundle', function () {
  it('should expose the correct API', function () {
    const api = ['quadrature', 'version'];
    expect(Object.keys(RecMath).sort()).to.eql(api);
  });

  it('should have the same version as package.json', function () {
    expect(RecMath.version).to.equal(pkg.version);
  });
});
