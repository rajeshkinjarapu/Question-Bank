'use client'

import { useState, useRef } from 'react'
import { A4Canvas } from './A4Canvas'
import { PreviewToolbar } from './PreviewToolbar'
import { DiagnosticsSidebar } from './DiagnosticsSidebar'
import { usePageAnalyzer } from '../hooks/usePageAnalyzer'
// import { exportPaperToDocx } from '@/features/docx-export/api/export'

export function PrintPreviewModal({ paperData, config, onClose }: any) {
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Custom hook that measures the DOM inside A4Canvas
  const { warnings, isAnalyzing } = usePageAnalyzer(containerRef)

  const handleExportPdf = () => {
    alert("Triggering backend XeLaTeX Compilation...")
  }

  const handleExportDocx = () => {
    alert("Triggering backend Pandoc OMML Compilation...")
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden">
      
      {/* Top Toolbar */}
      <PreviewToolbar 
        zoom={zoom} 
        setZoom={setZoom} 
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-neutral-100 overflow-auto">
          {/* We pass the ref down to the Canvas so the hook can measure its children */}
          <A4Canvas 
            ref={containerRef} 
            paperData={paperData} 
            config={config} 
            zoom={zoom} 
          />
        </div>

        {/* Right Sidebar - Diagnostics */}
        <DiagnosticsSidebar warnings={warnings} isAnalyzing={isAnalyzing} />
      </div>

    </div>
  )
}
