'use client'

import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { FeasibilityReport } from '../schema/blueprint'

export function FeasibilityReportModal({ report, onClose }: { report: FeasibilityReport, onClose: () => void }) {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border rounded-xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          {report.isFeasible ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-destructive" />
          )}
          <div>
            <h3 className="text-lg font-bold">{report.isFeasible ? 'Verification Passed' : 'Inventory Shortfall Detected'}</h3>
            <p className="text-sm text-muted-foreground">
              {report.isFeasible 
                ? 'Your Question Bank has enough inventory to fulfill this blueprint.' 
                : 'Your Question Bank cannot fulfill all the constraints defined in this blueprint.'}
            </p>
          </div>
        </div>

        {!report.isFeasible && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-destructive mb-3">Critical Shortfalls</h4>
            <ul className="space-y-3">
              {report.shortfalls.map((shortfall, idx) => (
                <li key={idx} className="text-sm flex justify-between items-center border-b border-destructive/10 pb-2 last:border-0 last:pb-0">
                  <span className="font-medium">{shortfall.constraint}</span>
                  <div className="text-xs space-x-2">
                    <span className="text-muted-foreground">Required: {shortfall.required}</span>
                    <span className="text-destructive font-bold">Available: {shortfall.available}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-accent text-sm">
            Edit Blueprint
          </button>
          {!report.isFeasible && (
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90">
              Save with Warning
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
