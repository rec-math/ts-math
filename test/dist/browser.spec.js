import { readFileSync } from 'fs';

import { expect } from 'chai';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

const iife = readFileSync(pkg.browser, 'utf8');
const RecMath = eval(`(() => { ${iife}; return RecMath })()`);

describe('The browser bundle', function () {
  it('should expose the correct API', function () {
    const api = ['integrate', 'version'];
    expect(Object.keys(RecMath).sort()).to.eql(api);
    expect(Object.keys(RecMath.integrate).sort()).to.eql(['quad']);
  });

  it('should have the same version as package.json', function () {
    expect(RecMath.version).to.equal(pkg.version);
  });

  describe('RecMath.integrate', function () {
    it('should expose the correct API', function () {
      const api = ['quad'];
      expect(Object.keys(RecMath.integrate).sort()).to.eql(api);
    });
  });
});
