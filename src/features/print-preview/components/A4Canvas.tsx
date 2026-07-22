'use client'

import { forwardRef } from 'react'

interface A4CanvasProps {
  paperData: any
  config: any
  zoom: number
}

/**
 * The physical representation of an A4 paper in the browser.
 * Uses strict mm dimensions.
 */
export const A4Canvas = forwardRef<HTMLDivElement, A4CanvasProps>(({ paperData, config, zoom }, ref) => {
  
  // A4 dimensions at standard 96 DPI: 210mm x 297mm
  // We use inline styles to enforce this strictly.
  const a4Style = {
    width: '210mm',
    minHeight: '297mm', // Use minHeight to allow overflow detection
    padding: '20mm',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    margin: '0 auto',
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
    transition: 'transform 0.2s ease-out',
    position: 'relative' as const,
    overflow: 'hidden' // Important: simulates physical paper edges
  }

  return (
    <div className="w-full flex justify-center py-8 bg-muted overflow-auto h-full relative" ref={ref}>
      <div style={a4Style} className="page-container flex flex-col">
        
        {/* Header Simulation */}
        <header className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
          {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="h-12 object-contain" />}
          <h1 className="text-xl font-bold font-serif uppercase">{config.headerText || 'EXAMINATION'}</h1>
        </header>

        {/* Instructions */}
        {config.instructions && (
          <div className="mb-6 pb-6 border-b border-gray-300">
            <h2 className="font-bold text-sm mb-2">Instructions:</h2>
            <p className="text-sm italic">{config.instructions}</p>
          </div>
        )}

        {/* Content Body - Wrapping in multi-col if requested */}
        <div className={`flex-1 text-sm ${config.columns === 2 ? 'columns-2 gap-8' : ''}`}>
          {paperData.questions.map((q: any, i: number) => (
            <div key={q.id} className="mb-6 break-inside-avoid">
              <div className="flex gap-2 font-medium mb-2">
                <span>Q{i + 1}.</span>
                {/* Normally we'd use a robust HTML-to-React parser here that integrates KaTeX. 
                    For simulation, dangerouslySetInnerHTML suffices to test DOM constraints. */}
                <div dangerouslySetInnerHTML={{ __html: q.statement }} />
              </div>
              
              {q.options && (
                <div className="pl-6 space-y-2 mt-2">
                  {q.options.map((opt: any, oIdx: number) => (
                    <div key={opt.id} className="flex gap-2">
                      <span className="font-bold">({String.fromCharCode(65 + oIdx)})</span>
                      <div dangerouslySetInnerHTML={{ __html: opt.content }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Simulation */}
        <footer className="mt-auto pt-4 border-t border-black text-center text-xs text-gray-500 flex justify-between absolute bottom-[20mm] left-[20mm] right-[20mm]">
          <span>{config.footerText}</span>
          <span>Page 1</span> {/* Pagination logic would sit here */}
        </footer>

      </div>
    </div>
  )
})

A4Canvas.displayName = 'A4Canvas'
