'use client'

import { ZoomIn, ZoomOut, FileDown, Printer, FileText } from 'lucide-react'

interface ToolbarProps {
  zoom: number
  setZoom: (z: number) => void
  onExportPdf: () => void
  onExportDocx: () => void
}

export function PreviewToolbar({ zoom, setZoom, onExportPdf, onExportDocx }: ToolbarProps) {
  return (
    <div className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold">Print Preview</h2>
        <div className="h-6 w-px bg-border" />
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-muted rounded-md p-1">
          <button 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-1 hover:bg-background rounded"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-1 hover:bg-background rounded"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-accent text-sm font-medium"
        >
          <Printer className="w-4 h-4" /> Print Direct
        </button>
        
        <button 
          onClick={onExportDocx}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
        >
          <FileText className="w-4 h-4" /> Export DOCX
        </button>

        <button 
          onClick={onExportPdf}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
        >
          <FileDown className="w-4 h-4" /> Export PDF
        </button>
      </div>
    </div>
  )
}
