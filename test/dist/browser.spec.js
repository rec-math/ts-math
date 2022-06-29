/* global RecMath */

import { readFileSync } from 'fs';

import { expect } from 'chai';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

const iife = readFileSync(pkg.browser, 'utf8');
// const RecMath = eval(`(() => { ${iife}; return RecMath })()`);
const globalEval = eval;
globalEval(iife);

describe('The browser bundle', function () {
  it('should expose the correct API', function () {
    const api = ['numerical', 'version'];
    expect(Object.keys(RecMath).sort()).to.eql(api);
  });

  it('should have the same version as package.json', function () {
    expect(RecMath.version).to.equal(pkg.version);
  });

  describe('RecMath.numerical', function () {
    it('should expose the correct API', function () {
      const api = ['quad'];
      expect(Object.keys(RecMath.numerical).sort()).to.eql(api);
    });
  });
});
