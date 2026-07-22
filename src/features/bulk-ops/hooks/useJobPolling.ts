'use client'

import { useQuery } from '@tanstack/react-query'
import { getJobStatus } from '../api/status'

/**
 * Custom hook to poll the backend for job progress.
 * If the job is 'pending' or 'processing', it polls every 2 seconds.
 * Once 'completed' or 'failed', polling stops automatically.
 */
export function useJobPolling(jobId: string | null) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobId ? getJobStatus(jobId) : null,
    enabled: !!jobId,
    refetchInterval: (query) => {
      // Access the data safely based on TanStack Query v5 API
      const status = query.state.data?.status
      if (status === 'pending' || status === 'processing') return 2000
      return false
    }
  })
}
