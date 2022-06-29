import { numerical } from '../../esm/index.js';

const { quad } = numerical;

const { sqrt, PI, sin, exp } = Math;
const infty = Infinity;
const negativeInfty = -infty;

const problems = {
  normalDistribution: {
    title: 'Normal distribution',
    f: (t) => exp(-0.5 * t * t) / sqrt(2 * PI),
    range: [negativeInfty, infty],
    exact: 1,
  },
  expT: {
    title: 'e^t',
    f: (t) => exp(t),
    range: [0, 128],
    exact: exp(128),
  },
  sinT: {
    title: 'sin(t) [0, \uD835\uDF0B]',
    f: (t) => sin(t),
    range: [0, PI],
    exact: 2,
  },
  endDiscontinuity: {
    title: 'Discontinuity at the end (1 / sqrt(3 - t))',
    f: (t) => 1 / sqrt(3 - t),
    range: [0, 3],
    exact: 2 * sqrt(3),
    options: { epsilon: 1e-4 },
  },
  dr01: {
    title: '1 / (x * Math.log(x) ** 2)',
    f: (x) => 1 / (x * Math.log(x) ** 2),
    range: [2, Infinity],
    exact: 0.19524754198276439,
    options: { epsilon: 0.001 },
  },
  dr03: {
    title: '1 / (x ** 1.01)',
    f: (x) => 1 / x ** 1.01,
    range: [2, Infinity],
    exact: 13.628,
    options: { epsilon: 0.01 },
  },
  ss10: {
    title: '1 / (1 + x * x)',
    f: (x) => 1 / (1 + x * x),
    range: [0, Infinity],
    exact: Math.PI / 2,
  },
  ss12: {
    title: 'e^(-x) * cos(x)',
    f: (x) => Math.exp(-x) * Math.cos(x),
    range: [0, Infinity],
    exact: 0.5,
  },
};

/*
const title = 'Discontinuity at the end.';
const [result, info] = integrate((t) => 1 / sqrt(3 - t), [0, 3]);
const exact = 2 * sqrt(3);
*/

// const [result, info] = integrate((t) => (1 / t), [0, 1]);

const report = (problem, method, heading) => {
  const { title, f, range, exact, options } = problem;
  const [result, info] = method(f, range, options);
  console.log();
  console.log(heading, title, range);
  console.log({
    result,
    error: exact - result,
    relativeError: (exact - result) / exact,
    info,
  });
};

Object.entries(problems).forEach(([key, problem]) => {
  if (problem.skip) {
    console.log('Skipped', key, problem.title, problem.range);
    return;
  }
  report(problem, quad, 'Gauss-Kronrod');
});

/*
report(problems.normalDistribution, quad, 'Gauss-Kronrod');

// report(problems.expT, simpson, 'Simpson');
report(problems.expT, quad, 'Gauss-Kronrod');

report(problems.sinT, quad, 'Gauss-Kronrod');

// report(problems.endDiscontinuity, quad, 'Gauss-Kronrod');
*/
