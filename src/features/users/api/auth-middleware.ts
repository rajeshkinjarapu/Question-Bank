import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * A highly secure middleware designed to protect Server Actions and APIs.
 * It strictly checks if the authenticated user has the required permission.
 */
export async function withPermission<T>(
  requiredAction: string,
  serverAction: () => Promise<T>
): Promise<T> {
  const supabase = await createClient()
  
  // 1. Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized: Please log in.')
  }

  // 2. Fetch User's Roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)

  if (!userRoles || userRoles.length === 0) {
    throw new Error('Forbidden: No roles assigned.')
  }

  const roleIds = userRoles.map(ur => ur.role_id)

  // 3. Check against Permissions Matrix
  const { data: permissions } = await supabase
    .from('permissions')
    .select('id')
    .in('role_id', roleIds)
    .eq('action', requiredAction)
    .limit(1)

  // 4. Actively reject if no permission is found
  if (!permissions || permissions.length === 0) {
    console.warn(`[SECURITY] User ${user.id} attempted unauthorized action: ${requiredAction}`)
    throw new Error(`403 Forbidden: You lack the '${requiredAction}' permission.`)
  }

  // 5. Execute the actual action if authorized
  return serverAction()
}
