'use server'

import { createClient } from '@/lib/supabase/server'
import { withPermission } from '../../users/api/auth-middleware'

export async function submitForReview(questionId: string) {
  // Only users with 'create_question' can submit (e.g., Setters, Admins)
  return withPermission('create_question', async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Update status
    await supabase.from('questions').update({ status: 'pending_review' }).eq('id', questionId)
    
    // Log transition
    await supabase.from('approval_history').insert({
      question_id: questionId, actor_id: user?.id, previous_status: 'draft', new_status: 'pending_review'
    })
    return { success: true }
  })
}

export async function approveQuestion(questionId: string) {
  // ONLY users with 'approve_question' can do this (e.g., Reviewers, Admins)
  return withPermission('approve_question', async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('questions').update({ status: 'approved' }).eq('id', questionId)
    await supabase.from('approval_history').insert({
      question_id: questionId, actor_id: user?.id, previous_status: 'pending_review', new_status: 'approved'
    })
    return { success: true }
  })
}

export async function rejectQuestion(questionId: string, commentText: string, highlightedHtml?: string) {
  // ONLY users with 'approve_question' can reject
  return withPermission('approve_question', async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Update status
    await supabase.from('questions').update({ status: 'rejected' }).eq('id', questionId)
    
    // 2. Add Comment
    await supabase.from('review_comments').insert({
      question_id: questionId, reviewer_id: user?.id, comment_text: commentText, highlighted_html_segment: highlightedHtml
    })

    // 3. Log transition
    await supabase.from('approval_history').insert({
      question_id: questionId, actor_id: user?.id, previous_status: 'pending_review', new_status: 'rejected'
    })
    return { success: true }
  })
}
