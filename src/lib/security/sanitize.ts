import DOMPurify from 'isomorphic-dompurify'

/**
 * XSS Protection Module
 * Since the system heavily relies on TipTap and mathematical HTML inputs,
 * we must aggressively strip malicious `<script>` tags, event handlers (onclick), 
 * and iframe injections BEFORE saving anything to the database.
 * 
 * However, we MUST preserve KaTeX classes (e.g. class="katex-mathml")
 * otherwise the math rendering will break.
 */

export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return ''

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 'span', 'div', 'br', 
      'sub', 'sup', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'tbody', 'thead',
      'img', 'math', 'mi', 'mo', 'mn', 'msup', 'mrow', 'mfrac', 'msqrt' // Allow MathML
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'src', 'alt', 'class', 'style', 
      'data-tex', 'data-id', 'width', 'height', 'xmlns'
    ],
    ALLOW_DATA_ATTR: true, // Crucial for storing raw LaTeX inside HTML datasets
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'] // Prevent JS execution
  })
}
