import { useState } from 'react'
import { uploadFile, BucketName, getPublicUrl } from '@/lib/supabase/storage'
import { v4 as uuidv4 } from 'uuid'

interface UseFileUploadOptions {
  bucket: BucketName
  folder?: string
  onSuccess?: (url: string, path: string) => void
  onError?: (error: Error) => void
}

export function useFileUpload({ bucket, folder = '', onSuccess, onError }: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0) // Note: Supabase JS doesn't natively support upload progress yet, but we stub it for future/custom XHR implementations
  const [error, setError] = useState<Error | null>(null)

  const upload = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setProgress(0)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // Simulate progress
      setProgress(50)
      
      const data = await uploadFile(bucket, filePath, file)
      setProgress(100)
      
      let finalUrl = filePath
      if (bucket !== 'generated-papers') {
        finalUrl = getPublicUrl(bucket, filePath)
      }

      setIsUploading(false)
      if (onSuccess) onSuccess(finalUrl, filePath)
      
      return { url: finalUrl, path: filePath, data }
    } catch (err: any) {
      setError(err)
      setIsUploading(false)
      if (onError) onError(err)
      throw err
    }
  }

  return { upload, isUploading, progress, error }
}
