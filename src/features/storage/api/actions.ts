'use server'

import { createClient } from '@/lib/supabase/server'
import { PrimaryBucket } from './manager'

/**
 * Implements "Soft Delete" pattern for storage.
 * Moves the file to the `_trash` folder within the same bucket instead of destroying it.
 */
export async function softDeleteFile(bucket: PrimaryBucket, currentPath: string) {
  const supabase = await createClient()

  // Extract the filename from the path
  const filename = currentPath.split('/').pop()
  if (!filename) throw new Error("Invalid path")

  const trashPath = `_trash/${filename}`

  // Move (Rename) object in Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .move(currentPath, trashPath)

  if (error) throw new Error(`Failed to trash file: ${error.message}`)

  return trashPath
}

/**
 * Recovers a file from the `_trash` folder back to its original location.
 */
export async function recoverFile(bucket: PrimaryBucket, trashPath: string, targetPath: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .move(trashPath, targetPath)

  if (error) throw new Error(`Failed to recover file: ${error.message}`)

  return targetPath
}
