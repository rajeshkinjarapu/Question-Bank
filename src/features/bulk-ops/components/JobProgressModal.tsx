'use client'

import { useJobPolling } from '../hooks/useJobPolling'
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react'

interface JobProgressModalProps {
  jobId: string | null
  onClose: () => void
}

export function JobProgressModal({ jobId, onClose }: JobProgressModalProps) {
  const { data: job, isLoading, error } = useJobPolling(jobId)

  if (!jobId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border rounded-xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-1">Processing Bulk Operation</h3>
        <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider">{job?.type?.replace(/_/g, ' ')}</p>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Failed to connect to background queue.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="capitalize text-primary">{job?.status}</span>
              <span>{job?.progress}%</span>
            </div>
            
            {/* Progress Bar Track */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${
                  job?.status === 'failed' ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${job?.progress || 0}%` }}
              />
            </div>

            {/* Results / Logs */}
            {job?.status === 'completed' && (
              <div className="flex items-start gap-3 mt-6 bg-green-500/10 text-green-600 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{job?.result?.message || 'Operation completed successfully.'}</p>
              </div>
            )}

            {job?.status === 'failed' && (
              <div className="flex items-start gap-3 mt-6 bg-destructive/10 text-destructive p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{job?.result?.error || 'An unexpected error occurred during processing.'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
