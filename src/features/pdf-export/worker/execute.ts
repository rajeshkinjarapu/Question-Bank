/**
 * This script is intended to run on a background Node.js worker (like Render)
 * that has `texlive-xetex` installed globally on the system.
 */
import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import { buildLatexDocument } from '../compiler/builder'

export async function compilePdf(jobId: string, paperData: any, config: any): Promise<string> {
  const workDir = path.join('/tmp', `latex_job_${jobId}`)
  
  try {
    // 1. Create isolated working directory
    await fs.mkdir(workDir, { recursive: true })

    // 2. Pre-process Images
    // (Logic here to find <img src="..."> in paperData, download them via fetch 
    // to workDir, and replace the src with the local path for the latex parser)
    
    // 3. Build .tex string
    const texContent = buildLatexDocument(paperData, config)
    const texFilePath = path.join(workDir, 'main.tex')
    await fs.writeFile(texFilePath, texContent, 'utf8')

    // 4. Execute XeLaTeX
    // -interaction=nonstopmode prevents the compiler from freezing waiting for input on errors
    await new Promise((resolve, reject) => {
      exec(`xelatex -interaction=nonstopmode -output-directory=${workDir} main.tex`, 
        (error, stdout, stderr) => {
          if (error) {
            console.error('[XeLaTeX Error]', stdout)
            return reject(new Error('LaTeX Compilation Failed.'))
          }
          resolve(stdout)
        }
      )
    })

    const pdfPath = path.join(workDir, 'main.pdf')
    
    // 5. Upload to Supabase (Pseudo-code)
    // const pdfBuffer = await fs.readFile(pdfPath)
    // await supabase.storage.from('private-exports').upload(`${jobId}.pdf`, pdfBuffer)

    return `${jobId}.pdf`

  } catch (error) {
    throw error
  } finally {
    // 6. Cleanup (CRITICAL: Do not leak disk space on the worker)
    await fs.rm(workDir, { recursive: true, force: true }).catch(console.error)
  }
}
