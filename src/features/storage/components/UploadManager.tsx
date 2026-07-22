'use client'

import { useAdvancedUpload } from '../hooks/useAdvancedUpload'
import { X, FileUp, CheckCircle, AlertCircle } from 'lucide-react'

/**
 * A floating global UI component to display the progress of all current uploads.
 */
export function UploadManagerUI({ uploadHook }: { uploadHook: ReturnType<typeof useAdvancedUpload> }) {
  const { uploads, clearCompleted } = uploadHook

  if (uploads.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card border rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[50vh]">
      <div className="bg-muted px-4 py-2 flex justify-between items-center border-b">
        <span className="text-sm font-semibold flex items-center gap-2">
          <FileUp className="w-4 h-4" /> Upload Manager
        </span>
        <button onClick={clearCompleted} className="text-xs hover:underline text-muted-foreground">Clear Done</button>
      </div>

      <div className="p-2 space-y-2 overflow-y-auto">
        {uploads.map(upload => (
          <div key={upload.id} className="text-sm p-2 border rounded-md relative bg-background">
            <div className="flex justify-between items-start mb-1">
              <span className="truncate font-medium pr-4">{upload.file.name}</span>
              {upload.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
              {upload.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{(upload.file.size / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span className="capitalize">{upload.status}</span>
            </div>

            {upload.status === 'uploading' && (
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            )}

            {upload.status === 'error' && (
              <div className="text-xs text-red-500 mt-1">{upload.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
