'use client'

import React, { useRef, useEffect, memo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { katexConfig } from '../utils/katex.config'

interface FormulaRendererProps {
  latex: string
  displayMode?: boolean
  className?: string
}

/**
 * A highly optimized, memoized React component for rendering static LaTeX safely.
 * Will not crash the UI on syntax errors (renders raw text in red instead).
 */
export const FormulaRenderer = memo(({ latex, displayMode = false, className = '' }: FormulaRendererProps) => {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex || '\\text{empty formula}', containerRef.current, {
          ...katexConfig,
          displayMode
        })
      } catch (error) {
        console.error('FormulaRenderer caught KaTeX error:', error)
      }
    }
  }, [latex, displayMode])

  return (
    <span 
      ref={containerRef} 
      className={`formula-renderer inline-block min-w-[10px] ${className} ${displayMode ? 'my-4 flex justify-center' : 'mx-1'}`} 
    />
  )
})

FormulaRenderer.displayName = 'FormulaRenderer'
