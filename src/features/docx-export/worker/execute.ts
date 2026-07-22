/**
 * This script runs on the background Node.js worker.
 * It requires `pandoc` to be installed globally on the host machine.
 */
import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import { buildPandocMarkdown } from '../templates/builder'

export async function compileDocx(jobId: string, paperData: any, config: any): Promise<string> {
  const workDir = path.join('/tmp', `docx_job_${jobId}`)
  
  try {
    // 1. Create isolated working directory
    await fs.mkdir(workDir, { recursive: true })

    // 2. Pre-process Images
    // Download <img src="..."> remote assets to local disk here.
    
    // 3. Build Markdown string
    const mdContent = buildPandocMarkdown(paperData, config)
    const mdFilePath = path.join(workDir, 'main.md')
    await fs.writeFile(mdFilePath, mdContent, 'utf8')

    // 4. Execute Pandoc
    // Pandoc will read the markdown/LaTeX string and compile it natively to Word DOCX, 
    // seamlessly converting $...$ LaTeX equations into native Office Math (OMML).
    const docxPath = path.join(workDir, 'main.docx')
    await new Promise((resolve, reject) => {
      exec(`pandoc ${mdFilePath} -o ${docxPath}`, 
        (error, stdout, stderr) => {
          if (error) {
            console.error('[Pandoc Error]', stderr)
            return reject(new Error('DOCX Compilation Failed.'))
          }
          resolve(stdout)
        }
      )
    })
    
    // 5. Upload to Supabase
    // const docxBuffer = await fs.readFile(docxPath)
    // await supabase.storage.from('private-exports').upload(`${jobId}.docx`, docxBuffer)

    return `${jobId}.docx`

  } catch (error) {
    throw error
  } finally {
    // 6. Cleanup disk space
    await fs.rm(workDir, { recursive: true, force: true }).catch(console.error)
  }
}
