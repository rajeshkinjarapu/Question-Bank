import { htmlToLatex } from '../../pdf-export/compiler/parser'

/**
 * Builds a Pandoc-flavored Markdown document.
 * Pandoc natively understands standard Markdown interspersed with LaTeX math 
 * (using $...$ for inline and $$...$$ for block). It uses this to seamlessly 
 * compile into Microsoft Word's OMML format.
 */
export function buildPandocMarkdown(paperData: any, config: any): string {
  let md = ''

  // Headers & Instructions
  md += `# ${config.headerText || 'Question Paper'}\n\n`
  
  if (config.instructions) {
    md += `**General Instructions:**\n${config.instructions}\n\n---\n\n`
  }

  // Iterate Questions
  paperData.questions.forEach((q: any, idx: number) => {
    // Convert the rich text HTML to LaTeX syntax, but wrap the math safely.
    // Assuming parser.ts handles standard translation.
    const statement = htmlToLatex(q.statement)
    
    md += `**Q${idx + 1}.** ${statement}\n\n`

    if (q.options && q.options.length > 0) {
      q.options.forEach((opt: any, oIdx: number) => {
        const letter = String.fromCharCode(65 + oIdx)
        md += `${letter}) ${htmlToLatex(opt.content)}\n\n`
      })
    }
    
    md += `\n` // Spacing between questions
  })

  // Answer Key
  if (paperData.answerKey) {
    md += `\\newpage\n\n# Answer Key\n\n`
    Object.keys(paperData.answerKey).forEach((qId, idx) => {
      const correctOptIndex = paperData.answerKey[qId]
      const letter = String.fromCharCode(65 + correctOptIndex)
      md += `**Q${idx + 1}.** ${letter}\n\n`
    })
  }

  return md
}
