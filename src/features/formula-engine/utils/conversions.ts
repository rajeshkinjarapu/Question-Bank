import katex from 'katex'
import { katexConfig } from './katex.config'

/**
 * Converts a raw LaTeX string into HTML string (with embedded MathML for screen readers).
 * This is used primarily for server-side rendering or static HTML generation.
 */
export function latexToHtml(latex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latex, {
      ...katexConfig,
      displayMode,
      output: 'htmlAndMathml' // Ensures accessibility
    })
  } catch (error) {
    console.error('KaTeX rendering error:', error)
    return `<span class="text-red-500" title="Invalid Formula">${latex}</span>`
  }
}

/**
 * Extracts ONLY the MathML from a LaTeX string.
 * Useful for exporting to XML-based formats or specific accessibility engines.
 */
export function latexToMathml(latex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latex, {
      ...katexConfig,
      displayMode,
      output: 'mathml'
    })
  } catch (error) {
    console.error('KaTeX MathML error:', error)
    return `<math><mtext>Error processing formula</mtext></math>`
  }
}

/**
 * Mocks the conversion of MathML to OMML (Office Math Markup Language).
 * In production, this requires an XSLT transformation running on the server (e.g. using xsltproc or a node wrapper).
 * OMML is strictly required for embedding native, editable equations into Microsoft Word (.docx) exports.
 */
export function mathmlToOmml(mathmlStr: string): string {
  // Stub for server-side XSLT transform
  console.log('[OMML Converter] Processing MathML string...')
  return `<m:oMath><m:r><m:t>OMML_STUB_FOR_WORD</m:t></m:r></m:oMath>`
}
