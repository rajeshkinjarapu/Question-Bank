/**
 * Mocks the image compression logic.
 * In a real environment, you'd use a library like 'browser-image-compression'
 * or use Canvas API to draw the image and export it as WebP with reduced quality.
 */
export async function optimizeImage(file: File, maxWidthOrHeight = 1920): Promise<File> {
  // Only process images
  if (!file.type.startsWith('image/')) {
    return file
  }

  console.log(`[Optimizer] Starting compression for ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)

  // Simulate compression delay (e.g. Canvas drawing)
  await new Promise(resolve => setTimeout(resolve, 800))

  // In reality: 
  // 1. Create ImageBitmap or HTMLImageElement
  // 2. Draw to Canvas at constrained dimensions
  // 3. return canvas.toBlob('image/webp', 0.8)

  // Mocking the result: changing name to .webp and pretending size is reduced
  const newName = file.name.substring(0, file.name.lastIndexOf('.')) + '.webp'
  const mockReducedBlob = new Blob([file], { type: 'image/webp' })
  const optimizedFile = new File([mockReducedBlob], newName, { type: 'image/webp' })

  console.log(`[Optimizer] Successfully compressed to ${newName}`)
  return optimizedFile
}
