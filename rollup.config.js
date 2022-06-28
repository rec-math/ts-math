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

const modules = [
  {
    moduleName: 'numerical',
    input: 'esm/numerical.js',
    file: 'dist/rec-math-numerical.min.js',
  },
];

const moduleOutput = {
  format: 'iife',
  name: exposeName,
  extend: true,
  sourcemap: true,
};

const builds = [
  // iife build for browser.
  {
    input,

    output: [
      {
        format: 'iife',
        banner,
        name: exposeName,
        extend: true,
        file: pkg.browser,
        sourcemap: true,
      },
    ],

    plugins: [terser()],
  },
];

modules.forEach(({ moduleName, input, file }) => {
  const banner = `/*! ${pkg.name}-${moduleName} v${pkg.version} ${datetime}
 *  This file includes only the \`${moduleName}\` module of RecMath.
 *  ${pkg.homepage}
 *  Copyright ${pkg.author} ${pkg.license} license.
 */
`;
  builds.push({
    input,
    output: [
      {
        ...moduleOutput,
        file,
        banner,
      },
    ],
    plugins: [terser()],
  });
});

export default builds;
