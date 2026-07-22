import { useEffect, useState } from 'react'
import { fetchItems, insertItem } from '@/lib/supabase/db'

export function useVersionHistory(questionId: string) {
  const [versions, setVersions] = useState<any[]>([])
  
  const loadVersions = async () => {
    try {
      const data = await fetchItems('question_versions', { question_id: questionId })
      setVersions(data || [])
    } catch (e) {
      console.error(e)
    }
  }

  const saveVersion = async (content: string, versionNumber: number) => {
    try {
      await insertItem('question_versions', {
        question_id: questionId,
        version_number: versionNumber,
        snapshot: { content }
      })
      await loadVersions()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadVersions()
  }, [questionId])

  return { versions, saveVersion }
}
