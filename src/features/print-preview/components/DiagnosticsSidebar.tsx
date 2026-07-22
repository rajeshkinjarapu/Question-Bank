'use client'

import { AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react'
import { DiagnosticWarning } from '../hooks/usePageAnalyzer'

export function DiagnosticsSidebar({ warnings, isAnalyzing }: { warnings: DiagnosticWarning[], isAnalyzing: boolean }) {
  
  if (isAnalyzing) {
    return (
      <div className="w-80 border-l bg-card p-6 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mb-4" />
        <p className="text-sm font-medium">Analyzing Page Layout...</p>
      </div>
    )
  }

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          Layout Diagnostics 
          <span className={`px-2 py-0.5 rounded-full text-xs ${warnings.length > 0 ? 'bg-amber-500/20 text-amber-700' : 'bg-green-500/20 text-green-700'}`}>
            {warnings.length}
          </span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {warnings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
            <Info className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Layout looks perfect. No overflows or missing formulas detected.</p>
          </div>
        ) : (
          warnings.map(w => (
            <div key={w.id} className={`p-3 border rounded-lg text-sm flex items-start gap-3 ${
              w.type === 'overflow' ? 'bg-destructive/5 border-destructive/20 text-destructive' :
              w.type === 'missing_formula' ? 'bg-red-500/5 border-red-500/20 text-red-600' :
              'bg-amber-500/5 border-amber-500/20 text-amber-700'
            }`}>
              {w.type === 'overflow' || w.type === 'missing_formula' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <p className="leading-tight">{w.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
