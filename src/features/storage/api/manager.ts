import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import { optimizeImage } from './image-optimizer'

export type PrimaryBucket = 'public-assets' | 'private-exports' | 'system-backups'
export type AssetFolder = 'question-images' | 'diagrams' | 'solutions' | 'generated-papers' | 'word-docs' | 'db-dumps' | '_trash'

export interface UploadOptions {
  bucket: PrimaryBucket
  folder: AssetFolder
  onProgress?: (progress: number) => void
  compressImage?: boolean
}

/**
 * Standardized upload manager executing compression and strict naming conventions.
 */
export async function uploadManagedFile(file: File, options: UploadOptions): Promise<{ path: string, url: string }> {
  const supabase = createClient()
  
  // 1. Compression Pipeline
  let targetFile = file
  if (options.compressImage && file.type.startsWith('image/')) {
    targetFile = await optimizeImage(file)
  }

  // 2. Naming Convention: {timestamp}_{uuid}_{clean_name}.{ext}
  const timestamp = new Date().getTime()
  const cleanName = targetFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '') // Remove special chars
  const uniquePath = `${options.folder}/${timestamp}_${uuidv4()}_${cleanName}`

  // 3. Upload with Progress (mocking progress calculation)
  // Note: Supabase JS client doesn't fully support uploadProgress yet without raw XMLHttpRequest. 
  // We simulate it here for the UI demo.
  options.onProgress?.(10)
  
  const { data, error } = await supabase.storage
    .from(options.bucket)
    .upload(uniquePath, targetFile, {
      cacheControl: '31536000',
      upsert: false // Prevent overriding
    })

  options.onProgress?.(100)

  if (error) throw error

  // 4. Return URL
  let url = ''
  if (options.bucket === 'public-assets') {
    url = supabase.storage.from(options.bucket).getPublicUrl(data.path).data.publicUrl
  } else {
    // For private, we'd need to generate a signed URL or serve via API route later
    url = `PRIVATE://${data.path}` 
  }

  return { path: data.path, url }
}
