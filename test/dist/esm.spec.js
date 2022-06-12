import { readFileSync } from 'fs';

import { expect } from 'chai';
import { version } from '../../esm/index.js';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

describe('The esm bundle', function () {
  it('should have the same version as package.json', function () {
    expect(version).to.equal(pkg.version);
  });
});
