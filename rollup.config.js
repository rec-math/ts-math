// rollup.config.js

import { readFileSync } from 'fs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

// Global name for browser bundle.
const exposeName = 'RecMath';

// Main entry point.
const input = 'src/index.ts';

// Submodules entry points.
const submodules = ['numerical'];
const buildEsmSubmodules = false;

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// Human timestamp for banner.
const datetime = new Date().toISOString().substring(0, 19).replace('T', ' ');

// Banner.
const banner = `/*! ${pkg.name} v${pkg.version} ${datetime}
 *  ${pkg.homepage}
 *  Copyright ${pkg.author} ${pkg.license} license.
 */
`;

const iifeOutput = {
  format: 'iife',
  name: exposeName,
  extend: true,
  sourcemap: true,
};

const esmOutput = {
  format: 'esm',
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

submodules.forEach((key) => {
  const input = `src/${key}.ts`;

  const banner = `/*! ${pkg.name}-${key} v${pkg.version} ${datetime}
 *
 *  This file includes only the RecMath.${key} module.
 *
 *  ${pkg.homepage}
 *  Copyright ${pkg.author} ${pkg.license} license.
 */
`;
  // Add the iife build for browsers.
  builds.push({
    input,
    output: {
      ...iifeOutput,
      file: `dist/rec-math-${key}.min.js`,
      banner,
    },

    plugins: [typescript(), terser()],
  });

  if (!buildEsmSubmodules) return;

  // Add the ES Module build for bundlers and node.
  builds.push({
    input,
    output: {
      ...esmOutput,
      file: `esm/${key}.js`,
      banner,
    },
    plugins: [typescript()],
  });
});

export default builds;
