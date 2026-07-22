import { useEffect, useRef, useState } from 'react'
import { updateItem } from '@/lib/supabase/db'

export function useAutoSave(questionId: string, initialContent: string, delay = 2000) {
  const [content, setContent] = useState(initialContent)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const onUpdate = (newContent: string) => {
    setContent(newContent)
    setStatus('saving')

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await updateItem('questions', questionId, {
          content: newContent,
          updated_at: new Date().toISOString()
        })
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      } catch (error) {
        console.error('AutoSave failed:', error)
        setStatus('error')
      }
    }, delay)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { content, onUpdate, status }
}
