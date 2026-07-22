export interface PdfConfig {
  paperSize: 'a4paper' | 'letterpaper' | 'legalpaper'
  columns: 1 | 2
  headerText: string
  footerText: string
  instructions: string
  logoPath?: string // Local absolute path to the downloaded logo on the worker
}

export function buildPreamble(config: PdfConfig): string {
  const margin = config.columns === 2 ? '0.5in' : '1in'
  
  return `
\\documentclass[11pt, ${config.paperSize}]{article}

% --- Core Packages ---
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{amsfonts}
\\usepackage[version=4]{mhchem} % For chemical equations
\\usepackage{graphicx}
\\usepackage{enumitem}
\\usepackage{multicol}
\\usepackage{booktabs}
\\usepackage{tabularx}
\\usepackage{fontspec}

% --- Page Geometry ---
\\usepackage[margin=${margin}]{geometry}

% --- Headers & Footers ---
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{${config.logoPath ? `\\includegraphics[height=1cm]{${config.logoPath}}` : ''}}
\\fancyhead[C]{\\textbf{${escapeLatex(config.headerText)}}}
\\fancyfoot[C]{${escapeLatex(config.footerText)} - Page \\thepage}
\\renewcommand{\\headrulewidth}{0.4pt}
\\renewcommand{\\footrulewidth}{0.4pt}

% --- Option Formatting ---
\\newlist{options}{enumerate}{1}
\\setlist[options]{label=\\textbf{(\\Alph*)}, itemsep=0pt, parsep=0pt, topsep=4pt}

\\begin{document}
`
}

/**
 * Escapes characters that are reserved in LaTeX (like % or &)
 */
export function escapeLatex(text: string): string {
  if (!text) return ''
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
}
