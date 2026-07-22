'use client'

import { useEffect, useState, RefObject } from 'react'

export interface DiagnosticWarning {
  id: string
  type: 'overflow' | 'blank_space' | 'missing_formula' | 'page_break'
  message: string
  pageIndex: number
}

/**
 * A sophisticated hook that measures the DOM of the simulated A4 container 
 * to detect layout anomalies before sending to the backend compiler.
 */
export function usePageAnalyzer(containerRef: RefObject<HTMLDivElement | null>) {
  const [warnings, setWarnings] = useState<DiagnosticWarning[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const analyze = () => {
      setIsAnalyzing(true)
      const newWarnings: DiagnosticWarning[] = []
      const container = containerRef.current!
      
      // We expect the container to have children representing distinct 'pages'
      const pages = Array.from(container.children) as HTMLElement[]

      pages.forEach((page, index) => {
        const scrollHeight = page.scrollHeight
        const clientHeight = page.clientHeight
        const innerText = page.innerText

        // 1. Overflow Detection (Content spills out of the 297mm height)
        if (scrollHeight > clientHeight + 5) { // 5px tolerance
          newWarnings.push({
            id: `overflow_${index}`,
            type: 'overflow',
            message: `Content on Page ${index + 1} exceeds physical boundaries. It will be clipped in PDF.`,
            pageIndex: index
          })
        }

        // 2. Blank Space Detection (Page is suspiciously empty)
        if (scrollHeight < clientHeight * 0.4 && index !== pages.length - 1) {
          newWarnings.push({
            id: `blank_${index}`,
            type: 'blank_space',
            message: `Page ${index + 1} has excessive blank space. Consider adjusting layout.`,
            pageIndex: index
          })
        }

        // 3. Missing Formula Detection (Dangling LaTeX delimiters)
        // If KaTeX fails to render, the raw $...$ or \(...\) will remain in the DOM text.
        if (/(?<!\\)\$|\\\(/g.test(innerText)) {
           newWarnings.push({
            id: `formula_${index}`,
            type: 'missing_formula',
            message: `Unrendered mathematical formula detected on Page ${index + 1}.`,
            pageIndex: index
          })
        }
      })

      setWarnings(newWarnings)
      setIsAnalyzing(false)
    }

    // Give the DOM a moment to render KaTeX before measuring
    const timeout = setTimeout(analyze, 1000)
    
    // Set up ResizeObserver to re-run if window/container changes
    const observer = new ResizeObserver(() => analyze())
    observer.observe(containerRef.current)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [containerRef])

  return { warnings, isAnalyzing }
}
