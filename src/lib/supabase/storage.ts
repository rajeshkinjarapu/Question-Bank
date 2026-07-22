import { createClient } from './client'

export type BucketName = 'question-diagrams' | 'generated-papers' | 'user-uploads'

export async function uploadFile(bucket: BucketName, path: string, file: File) {
  const supabase = createClient()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  return data
}

export function getPublicUrl(bucket: BucketName, path: string) {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(bucket: BucketName, path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    throw error
  }
  return true
}

export async function downloadPrivateFile(bucket: BucketName, path: string) {
  const supabase = createClient()
  const { data, error } = await supabase.storage.from(bucket).download(path)
  if (error) {
    throw error
  }
  return data
}
