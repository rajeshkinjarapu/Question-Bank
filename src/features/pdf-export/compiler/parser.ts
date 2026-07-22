/**
 * The TipTap editor outputs HTML (e.g., <b>bold</b>, <i>italic</i>) 
 * but our math/formulas are already stored in pure LaTeX via KaTeX/MathLive.
 * 
 * This parser cleans up the HTML and maps it to native LaTeX commands,
 * ensuring seamless inline math rendering.
 */
export function htmlToLatex(html: string): string {
  if (!html) return ''

  let tex = html

  // 1. Strip Paragraphs and replace with newlines
  tex = tex.replace(/<p[^>]*>/g, '')
  tex = tex.replace(/<\/p>/g, '\n\n')
  tex = tex.replace(/<br\s*\/?>/gi, '\\newline\n')

  // 2. Formatting
  tex = tex.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '\\textbf{$1}')
  tex = tex.replace(/<b[^>]*>(.*?)<\/b>/gi, '\\textbf{$1}')
  tex = tex.replace(/<em[^>]*>(.*?)<\/em>/gi, '\\textit{$1}')
  tex = tex.replace(/<i[^>]*>(.*?)<\/i>/gi, '\\textit{$1}')
  tex = tex.replace(/<u[^>]*>(.*?)<\/u>/gi, '\\underline{$1}')

  // 3. Image Tags (This is critical: images must be downloaded to disk first)
  // We assume a separate preprocessing step has replaced the remote URLs 
  // with local absolute paths on the worker machine.
  tex = tex.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, '\\begin{center}\\includegraphics[max width=\\linewidth]{$1}\\end{center}')

  // 4. Clean up stray HTML entities
  tex = tex.replace(/&nbsp;/g, '~')
  tex = tex.replace(/&lt;/g, '<')
  tex = tex.replace(/&gt;/g, '>')
  tex = tex.replace(/&amp;/g, '\\&')

  return tex.trim()
}
