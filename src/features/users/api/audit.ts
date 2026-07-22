import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

interface AuditParams {
  userId: string
  actionType: 'LOGIN' | 'CREATE_QUESTION' | 'APPROVE_QUESTION' | 'EXPORT_PDF' | 'PASSWORD_RESET' | 'DEACTIVATE_USER'
  entityType?: 'question' | 'user' | 'paper'
  entityId?: string
}

/**
 * Captures user activity and logs it securely in the database.
 * This is crucial for Enterprise environments where tracking IP and devices is mandatory.
 */
export async function logUserActivity({ userId, actionType, entityType, entityId }: AuditParams) {
  const supabase = await createClient()
  
  // Attempt to extract IP and User-Agent from Next.js Headers
  const reqHeaders = await headers()
  const ipAddress = reqHeaders.get('x-forwarded-for') || reqHeaders.get('x-real-ip') || 'unknown'
  const userAgent = reqHeaders.get('user-agent') || 'unknown'

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: userId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      ip_address: ipAddress,
      user_agent: userAgent
    })

  if (error) {
    console.error('[AUDIT_ERROR] Failed to log activity:', error.message)
    // We typically don't throw here to avoid breaking the main user flow, 
    // but in strict mode, you might want to.
  }
}
