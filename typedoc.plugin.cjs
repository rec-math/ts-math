const { JSX } = require('typedoc');

exports.load = function (app) {
  /**
   * Add MathJax to the `<head>` so we can use \\( \LaTeX \\) in the
   * documentation.
   */
  app.renderer.hooks.on('head.end', () => {
    return JSX.createElement(
      JSX.Fragment,
      null,
      JSX.createElement('script', {
        id: 'MathJax-script',
        async: true,
        src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js',
      }),
      JSX.createElement('script', {}, '// Comment'),
    );
  });
};
