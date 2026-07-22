'use client'

import React from 'react'

interface FormulaToolbarProps {
  onInsert: (latex: string) => void
}

const SYMBOL_CATEGORIES = [
  {
    name: 'Calculus & Algebra',
    symbols: [
      { label: 'Fraction', tex: '\\frac{a}{b}' },
      { label: 'Root', tex: '\\sqrt{x}' },
      { label: 'Integral', tex: '\\int_{a}^{b}' },
      { label: 'Sigma', tex: '\\sum_{i=1}^{n}' },
      { label: 'Limit', tex: '\\lim_{x \\to \\infty}' },
      { label: 'Log', tex: '\\log_{10}(x)' },
      { label: 'Matrix', tex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' }
    ]
  },
  {
    name: 'Physics & Vectors',
    symbols: [
      { label: 'Vector', tex: '\\vec{v}' },
      { label: 'Subscript', tex: 'v_{0}' },
      { label: 'Superscript', tex: 'x^{2}' },
      { label: 'Delta', tex: '\\Delta' },
      { label: 'Omega', tex: '\\Omega' },
      { label: 'Mu', tex: '\\mu' }
    ]
  },
  {
    name: 'Chemistry',
    symbols: [
      { label: 'Reaction Arrow', tex: '\\ce{->}' },
      { label: 'Equilibrium', tex: '\\ce{<=>}' },
      { label: 'Isotope', tex: '\\ce{^{238}_{92}U}' },
      { label: 'Precipitate', tex: '\\ce{v}' },
      { label: 'Gas', tex: '\\ce{^}' }
    ]
  }
]

export function FormulaToolbar({ onInsert }: FormulaToolbarProps) {
  return (
    <div className="bg-card border rounded-md shadow-sm p-4 w-full max-w-2xl">
      <h3 className="text-sm font-semibold mb-3 border-b pb-1">Quick Insert Syntax</h3>
      
      <div className="space-y-4">
        {SYMBOL_CATEGORIES.map(category => (
          <div key={category.name}>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{category.name}</p>
            <div className="flex flex-wrap gap-2">
              {category.symbols.map(sym => (
                <button
                  key={sym.label}
                  onClick={() => onInsert(sym.tex)}
                  className="px-2 py-1 text-xs bg-muted hover:bg-primary/20 hover:text-primary border rounded transition-colors"
                  title={sym.tex}
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
