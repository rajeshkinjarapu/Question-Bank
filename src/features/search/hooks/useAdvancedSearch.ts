'use client'

import { useState, useEffect } from 'react'
import { executeAdvancedSearch } from '../api/engine'
import { SearchFilters } from '../types/filters'
import { useQuery } from '@tanstack/react-query'

/**
 * Standard hook for managing the complex advanced search state.
 * In a real Next.js 15 app, state would ideally be synced to URL params via 'nuqs'
 * to ensure users can share filter links. We mock the state here.
 */
export function useAdvancedSearch(initialFilters: Partial<SearchFilters> = {}) {
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    page: 1, limit: 20, isFuzzy: true, ...initialFilters
  })

  // Debounce the query string specifically so it doesn't slam the DB on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(filters.query), 400)
    return () => clearTimeout(timer)
  }, [filters.query])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['advanced-search', { ...filters, query: debouncedQuery }],
    queryFn: () => executeAdvancedSearch({ ...filters, query: debouncedQuery }),
    staleTime: 5000,
    keepPreviousData: true
  })

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const resetFilters = () => {
    setFilters({ page: 1, limit: 20, isFuzzy: true })
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    results: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch
  }
}
