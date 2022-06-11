import { expect } from 'chai';
import { version } from '../../esm/index.js';

import pkg from '../../package.json';

describe('The esm bundle', function () {
  it('should have the same version as package.json', function () {
    expect(version).to.equal(pkg.version);
  });
});
