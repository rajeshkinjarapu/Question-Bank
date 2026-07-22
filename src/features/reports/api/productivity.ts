'use server'

import { createClient } from '@/lib/supabase/server'
import { withPermission } from '../../users/api/auth-middleware'

export interface UserProductivityRow {
  userId: string
  userName: string
  questionsCreated: number
  questionsApproved: number
  questionsRejected: number
}

/**
 * Aggregates productivity data for all staff.
 * In a real production scenario, this complex join should ideally be a 
 * Postgres Materialized View or an RPC function for maximum speed.
 */
export async function getUserProductivityReport(): Promise<UserProductivityRow[]> {
  return withPermission('manage_users', async () => {
    const supabase = await createClient()

    // 1. Fetch all active staff
    const { data: users } = await supabase.from('profiles').select('id, full_name').eq('is_active', true)
    
    // 2. Fetch all approval history (who approved/rejected what)
    const { data: history } = await supabase.from('approval_history').select('actor_id, new_status')

    // 3. Fetch all questions (who created what)
    const { data: questions } = await supabase.from('questions').select('created_by')

    if (!users) return []

    // 4. Aggregate data in memory (fallback if no RPC)
    return users.map(user => {
      const created = questions?.filter(q => q.created_by === user.id).length || 0
      const approved = history?.filter(h => h.actor_id === user.id && h.new_status === 'approved').length || 0
      const rejected = history?.filter(h => h.actor_id === user.id && h.new_status === 'rejected').length || 0

      return {
        userId: user.id,
        userName: user.full_name || 'Unknown',
        questionsCreated: created,
        questionsApproved: approved,
        questionsRejected: rejected
      }
    }).sort((a, b) => b.questionsCreated - a.questionsCreated) // Sort by most productive
  })
}
