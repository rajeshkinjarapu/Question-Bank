import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

type Role = 'super_admin' | 'admin' | 'question_setter' | 'reviewer' | 'teacher' | 'viewer'

export function usePermissions() {
  const { user, loading: authLoading } = useAuth()
  const [role, setRole] = useState<Role>('viewer')
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPermissions() {
      if (!user) {
        setRole('viewer')
        setPermissions([])
        setLoading(false)
        return
      }

      // Fetch user role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      const userRole = userData?.role || 'viewer'
      setRole(userRole)

      // Fetch permissions for role
      const { data: rolePerms } = await supabase
        .from('role_permissions')
        .select('permissions(action)')
        .eq('role', userRole)

      const perms = rolePerms?.map((rp: any) => rp.permissions.action) || []
      setPermissions(perms)
      setLoading(false)
    }

    if (!authLoading) {
      fetchPermissions()
    }
  }, [user, authLoading, supabase])

  const hasPermission = (action: string) => {
    if (role === 'super_admin') return true
    return permissions.includes(action)
  }

  return { role, permissions, loading: loading || authLoading, hasPermission }
}
