import { quad } from '../../esm/integrate/index.js';

const { sqrt, PI, sin, exp } = Math;
const negativeInfty = Number.NEGATIVE_INFINITY;
const infty = Number.POSITIVE_INFINITY;

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
  },
};

/*
const title = 'Discontinuity at the end.';
const [result, info] = integrate((t) => 1 / sqrt(3 - t), [0, 3]);
const exact = 2 * sqrt(3);
*/

// const [result, info] = integrate((t) => (1 / t), [0, 1]);
// const exact = Number.POSITIVE_INFINITY;

const report = (problem, method, heading) => {
  const { title, f, range, exact } = problem;
  const [result, info] = method(f, range);
  console.log();
  console.log(heading, title, range);
  console.log({
    result,
    error: exact - result,
    relativeError: (exact - result) / exact,
    info,
  });
};

report(problems.normalDistribution, quad, 'Gauss-Kronrod');

// report(problems.expT, simpson, 'Simpson');
report(problems.expT, quad, 'Gauss-Kronrod');

// report(problems.sinT, simpson, 'Simpson');
report(problems.sinT, quad, 'Gauss-Kronrod');

// report(problems.endDiscontinuity, simpson, 'Simpson');
report(problems.endDiscontinuity, quad, 'Gauss-Kronrod');
