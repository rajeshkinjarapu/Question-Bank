import { buildPreamble, escapeLatex, PdfConfig } from '../templates/preamble'
import { htmlToLatex } from './parser'

/**
 * Assembles the final raw .tex string to be passed to XeLaTeX.
 */
export function buildLatexDocument(paperData: any, config: PdfConfig): string {
  let tex = buildPreamble(config)

  // Title / Instructions
  tex += `\\begin{center}\n`
  tex += `  \\vspace{10pt}\n`
  tex += `  \\textbf{General Instructions:} \\\\\n`
  tex += `  ${escapeLatex(config.instructions)}\n`
  tex += `\\end{center}\n`
  tex += `\\vspace{20pt}\n\n`

  // Columns Check
  if (config.columns === 2) {
    tex += `\\begin{multicols}{2}\n`
  }

  // Iterate Questions
  tex += `\\begin{enumerate}[label=\\textbf{Q\\arabic*.}, itemsep=15pt, leftmargin=*]\n`
  
  for (const q of paperData.questions) {
    tex += `  \\item ${htmlToLatex(q.statement)}\n`
    
    // Check for Options
    if (q.options && q.options.length > 0) {
      tex += `  \\vspace{6pt}\n`
      tex += `  \\begin{options}\n`
      for (const opt of q.options) {
        tex += `    \\item ${htmlToLatex(opt.content)}\n`
      }
      tex += `  \\end{options}\n`
    }
  }
  
  tex += `\\end{enumerate}\n`

  if (config.columns === 2) {
    tex += `\\end{multicols}\n`
  }

  // Generate Answer Key on a New Page
  if (paperData.answerKey) {
    tex += `\\newpage\n`
    tex += `\\section*{Answer Key}\n`
    tex += `\\begin{multicols}{4}\n`
    tex += `\\begin{itemize}[label={}, leftmargin=0pt]\n`
    Object.keys(paperData.answerKey).forEach((qId, idx) => {
      const correctOptIndex = paperData.answerKey[qId] // e.g. 0, 1, 2, 3
      const letter = String.fromCharCode(65 + correctOptIndex) // A, B, C, D
      tex += `  \\item \\textbf{Q${idx + 1}.} ${letter}\n`
    })
    tex += `\\end{itemize}\n`
    tex += `\\end{multicols}\n`
  }

  tex += `\\end{document}\n`
  return tex
}
