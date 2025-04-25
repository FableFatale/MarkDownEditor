import katex from 'katex';

export interface LatexRenderOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  strict?: boolean;
}

export class LatexService {
  static renderLatex(latex: string, options: LatexRenderOptions = {}) {
    const defaultOptions: LatexRenderOptions = {
      displayMode: false,
      throwOnError: false,
      strict: false,
      ...options
    };

    try {
      return {
        html: katex.renderToString(latex, defaultOptions),
        error: null
      };
    } catch (err) {
      return {
        html: '',
        error: (err as Error).message
      };
    }
  }

  static validateLatex(latex: string): boolean {
    try {
      katex.renderToString(latex, { throwOnError: true });
      return true;
    } catch {
      return false;
    }
  }

  static getCommonTemplates() {
    return {
      fraction: '\\frac{分子}{分母}',
      squareRoot: '\\sqrt{被开方数}',
      nthRoot: '\\sqrt[n]{被开方数}',
      sum: '\\sum_{i=1}^{n} x_i',
      integral: '\\int_{a}^{b} f(x) dx',
      limit: '\\lim_{x \\to \\infty} f(x)',
      matrix: '\\begin{matrix} a & b \\\\ c & d \\end{matrix}',
      subscript: 'x_{下标}',
      superscript: 'x^{上标}',
      vector: '\\vec{x}'
    };
  }
}