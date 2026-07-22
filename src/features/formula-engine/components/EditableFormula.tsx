'use client'

import React, { useRef, useEffect } from 'react'
import { FormulaRenderer } from './FormulaRenderer'

interface EditableFormulaProps {
  latex: string
  onChange: (latex: string) => void
  isEditing: boolean
  onBlur: () => void
  onFocus: () => void
}

/**
 * A reusable component that toggles between a static KaTeX view and an interactive MathLive keyboard.
 * Can be used anywhere outside of the TipTap editor.
 */
export function EditableFormula({ latex, onChange, isEditing, onBlur, onFocus }: EditableFormulaProps) {
  const mathLiveRef = useRef<any>(null)

  useEffect(() => {
    if (isEditing && mathLiveRef.current) {
      mathLiveRef.current.focus()
    }
  }, [isEditing])

  const handleInput = (e: any) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      onBlur()
    }
  }

  if (isEditing) {
    return (
      <span className="inline-block border border-primary p-1 rounded shadow-sm bg-background z-50">
        {/* Assumes MathLive web component script is loaded globally */}
        <math-field 
          ref={mathLiveRef}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          style={{ fontSize: '1.2em', minWidth: '100px' }}
        >
          {latex}
        </math-field>
      </span>
    )
  }

  return (
    <span 
      onClick={onFocus}
      className="cursor-text hover:bg-accent hover:ring-1 hover:ring-primary/50 rounded inline-block transition-colors"
      title="Click to edit formula"
    >
      <FormulaRenderer latex={latex} />
    </span>
  )
}
