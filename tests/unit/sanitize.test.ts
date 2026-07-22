import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../../src/lib/security/sanitize'

describe('HTML Sanitizer (Phase 27)', () => {
  
  it('should strip malicious <script> tags', () => {
    const dirty = '<p>Solve this: <script>alert("hack")</script> x = 2</p>'
    const clean = sanitizeHtml(dirty)
    expect(clean).toBe('<p>Solve this:  x = 2</p>')
    expect(clean).not.toContain('<script>')
  })

  it('should strip event handlers like onclick', () => {
    const dirty = '<a href="#" onclick="stealCookies()">Click me</a>'
    const clean = sanitizeHtml(dirty)
    expect(clean).toBe('<a href="#">Click me</a>')
    expect(clean).not.toContain('onclick')
  })

  it('should PRESERVE strict mathematical tags (MathML)', () => {
    const mathml = '<math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mn>2</mn></msup></math>'
    const clean = sanitizeHtml(mathml)
    expect(clean).toBe(mathml) // Must be exactly identical
  })

  it('should PRESERVE KaTeX classes', () => {
    const latexHtml = '<span class="katex"><span class="katex-mathml">x^2</span></span>'
    const clean = sanitizeHtml(latexHtml)
    expect(clean).toContain('class="katex"')
    expect(clean).toContain('class="katex-mathml"')
  })
})
