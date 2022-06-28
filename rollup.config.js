// rollup.config.js

import { readFileSync } from 'fs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

// Global name for browser bundle.
const exposeName = 'RecMath';

// Main entry point.
const input = 'src/index.ts';

// Modules entry points.
const modules = [
  {
    moduleName: 'numerical',
    input: 'src/numerical.ts',
    file: 'dist/rec-math-numerical.min.js',
    esmFile: 'esm/numerical.js',
  },
];

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// Human timestamp for banner.
const datetime = new Date().toISOString().substring(0, 19).replace('T', ' ');

// Banner.
const banner = `/*! ${pkg.name} v${pkg.version} ${datetime}
 *  ${pkg.homepage}
 *  Copyright ${pkg.author} ${pkg.license} license.
 */
`;

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

    plugins: [typescript(), terser()],
  },

  // ES Module build for node and bundlers.
  {
    input,

    output: [
      {
        format: 'es',
        banner,
        file: pkg.module,
        sourcemap: true,
      },
    ],

    plugins: [typescript()],
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
    plugins: [typescript(), terser()],
  });
});

export default builds;
