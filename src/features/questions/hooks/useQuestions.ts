'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuestions, createQuestion, softDeleteQuestion, cloneQuestion, QueryOptions } from '../api/actions'
import { QuestionFormValues } from '../schema/validation'

// NOTE: Since getQuestions is in queries.ts, we import it from there. 
// Assuming aliasing for simplicity here as they are server actions.

export function useQuestions(queryOptions: QueryOptions) {
  const queryClient = useQueryClient()
  const queryKey = ['questions', queryOptions]

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      // Import dynamically or pass from client component to avoid server/client issues
      const { getQuestions } = await import('../api/queries')
      return getQuestions(queryOptions)
    },
  })

  const createMutation = useMutation({
    mutationFn: (newQ: QuestionFormValues) => createQuestion(newQ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => softDeleteQuestion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })

  const cloneMutation = useMutation({
    mutationFn: (id: string) => cloneQuestion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })

  return {
    questions: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    createQuestion: createMutation.mutateAsync,
    deleteQuestion: deleteMutation.mutateAsync,
    cloneQuestion: cloneMutation.mutateAsync,
    isMutating: createMutation.isPending || deleteMutation.isPending || cloneMutation.isPending
  }
}
