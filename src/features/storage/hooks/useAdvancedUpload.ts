'use client'

import { useState } from 'react'
import { uploadManagedFile, UploadOptions } from '../api/manager'
import { softDeleteFile } from '../api/actions'

export type UploadState = {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

export function useAdvancedUpload() {
  const [uploads, setUploads] = useState<UploadState[]>([])

  const startUpload = async (file: File, options: Omit<UploadOptions, 'onProgress'>) => {
    const id = crypto.randomUUID()
    
    setUploads(prev => [...prev, {
      id, file, progress: 0, status: 'pending'
    }])

    try {
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'uploading' } : u))
      
      const { url } = await uploadManagedFile(file, {
        ...options,
        onProgress: (prog) => {
          setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: prog } : u))
        }
      })

      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'success', progress: 100, url } : u))
      
      return url
    } catch (err: any) {
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error', error: err.message } : u))
      throw err
    }
  }

  const trashFile = async (bucket: any, path: string) => {
    return await softDeleteFile(bucket, path)
  }

  const clearCompleted = () => {
    setUploads(prev => prev.filter(u => u.status !== 'success'))
  }

  return {
    uploads,
    startUpload,
    trashFile,
    clearCompleted
  }
}
