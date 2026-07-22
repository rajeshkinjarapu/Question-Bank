import { KatexOptions } from 'katex'

/**
 * Centralized KaTeX configuration for the Formula Engine.
 * Ensures consistent parsing and rendering of Physics, Chemistry, and Math formulas.
 */
export const katexConfig: KatexOptions = {
  throwOnError: false,          // Render raw LaTeX in red instead of crashing the app
  errorColor: '#cc0000',        // Highlight syntax errors
  strict: false,                // Allow slightly malformed LaTeX for better UX
  trust: true,                  // Required for certain advanced macros
  macros: {
    // Chemistry Macros (Requires mhchem extension to be loaded in the environment)
    '\\ce': '\\mathrm{#1}',      // Fallback stub if mhchem isn't loaded, usually handled natively if script included
    
    // Physics Macros
    '\\vec': '\\mathbf{#1}',     // Bold vectors instead of arrows (preference)
    '\\unit': '\\,\\mathrm{#1}', // Standardized unit spacing (e.g. \unit{kg\,m/s^2})
    '\\d': '\\mathrm{d}',        // Derivative operator (e.g. \frac{\d x}{\d t})
    
    // Math Macros
    '\\R': '\\mathbb{R}',        // Real numbers
    '\\N': '\\mathbb{N}',        // Natural numbers
    '\\Z': '\\mathbb{Z}',        // Integers
    '\\C': '\\mathbb{C}',        // Complex numbers
    '\\lim': '\\mathop{\\rm lim}\\limits', // Better limit spacing
  }
}
