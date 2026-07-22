import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function MathNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const mathLiveRef = useRef<any>(null) // Ref for mathlive element
  const containerRef = useRef<HTMLSpanElement>(null)

  const latex = node.attrs.latex || ''

  useEffect(() => {
    if (!isEditing && containerRef.current) {
      try {
        katex.render(latex || '\\text{empty math}', containerRef.current, {
          throwOnError: false,
          displayMode: false,
        })
      } catch (err) {
        console.error('KaTeX error:', err)
      }
    }
  }, [latex, isEditing])

  useEffect(() => {
    if (isEditing && mathLiveRef.current) {
      mathLiveRef.current.focus()
    }
  }, [isEditing])

  const handleMathLiveInput = (e: any) => {
    updateAttributes({ latex: e.target.value })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return (
    <NodeViewWrapper className={`inline-block mx-1 ${selected ? 'ring-2 ring-primary rounded' : ''}`}>
      {isEditing ? (
        <span className="inline-block border border-primary p-1 rounded shadow-sm bg-background z-50">
          {/* We assume mathlive is imported via a script tag or web component definition in layout */}
          <math-field 
            ref={mathLiveRef}
            onInput={handleMathLiveInput}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            style={{ fontSize: '1.2em' }}
          >
            {latex}
          </math-field>
        </span>
      ) : (
        <span 
          ref={containerRef} 
          onClick={() => setIsEditing(true)}
          className="cursor-pointer hover:bg-accent rounded px-1 min-w-[20px] inline-block"
        />
      )}
    </NodeViewWrapper>
  )
}
