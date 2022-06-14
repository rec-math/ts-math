// rollup.config.js

import { readFileSync } from 'fs';
import { terser } from 'rollup-plugin-terser';

// Source entry point.
const input = 'esm/index.js';

// Global name for browser bundle.
const exposeName = 'RecMath';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// Human timestamp for banner.
const datetime = new Date().toISOString().substring(0, 19).replace('T', ' ');

// Banner.
const banner = `/*! ${pkg.name} v${pkg.version} ${datetime}
 *  ${pkg.homepage}
 *  Copyright ${pkg.author} ${pkg.license} license.
 */
`;

export default [
  // iife build for browser.
  {
    input,

    output: [
      {
        format: 'iife',
        banner,
        name: exposeName,
        file: pkg.browser,
        sourcemap: true,
      },
    ],

    plugins: [terser()],
  },
];
