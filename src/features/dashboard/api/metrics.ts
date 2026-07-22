'use server'

import { createClient } from '@/lib/supabase/server'

export interface DashboardMetrics {
  totalQuestions: number
  totalPapers: number
  activeUsers: number
  pendingReviews: number
  ocrJobs: number
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()

  // Execute all count queries in parallel for performance
  const [questionsRes, papersRes, usersRes, reviewsRes, ocrRes] = await Promise.all([
    supabase.from('questions').select('id', { count: 'exact', head: true }),
    supabase.from('generated_papers').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('questions').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('type', 'ocr_import')
  ])

  return {
    totalQuestions: questionsRes.count || 0,
    totalPapers: papersRes.count || 0,
    activeUsers: usersRes.count || 0,
    pendingReviews: reviewsRes.count || 0,
    ocrJobs: ocrRes.count || 0,
  }
}

/**
 * Mocks the chart data for presentation purposes.
 * In production, this would call specialized Supabase RPC functions (e.g. grouped by Subject/Month).
 */
export async function getChartData() {
  return {
    subjectData: [
      { name: 'Physics', value: 4500 },
      { name: 'Chemistry', value: 3800 },
      { name: 'Mathematics', value: 5200 },
      { name: 'Biology', value: 2100 }
    ],
    difficultyData: [
      { name: 'Easy', value: 40 },
      { name: 'Medium', value: 45 },
      { name: 'Hard', value: 15 }
    ],
    activityData: [
      { name: 'Jan', imports: 400, generations: 240 },
      { name: 'Feb', imports: 300, generations: 139 },
      { name: 'Mar', imports: 200, generations: 980 },
      { name: 'Apr', imports: 278, generations: 390 },
      { name: 'May', imports: 189, generations: 480 },
      { name: 'Jun', imports: 239, generations: 380 },
    ]
  }
}
