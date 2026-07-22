import { createClient } from '@/lib/supabase/server'

export async function logActivity({
  action,
  resource,
  metadata = {},
}: {
  action: string
  resource?: string
  metadata?: Record<string, any>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action,
    resource,
    metadata,
  })
}
