'use client'

import { ReactNode } from 'react'
import { usePermissions } from '../hooks/usePermissions'

interface PermissionGuardProps {
  action: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ action, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission, loading } = usePermissions()

  if (loading) {
    return <div className="animate-pulse bg-muted h-8 w-full rounded-md" />
  }

  if (!hasPermission(action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
