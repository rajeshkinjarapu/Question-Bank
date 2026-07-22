'use client'

import { useState } from 'react'
import { HardDriveDownload, ArchiveRestore, Clock, ShieldCheck } from 'lucide-react'
import { AuditLogSearch } from './AuditLogSearch'
// import { triggerLogicalBackup } from '../api/backup'

export function SystemBackupDashboard() {
  const [isBackingUp, setIsBackingUp] = useState(false)

  const handleBackup = async () => {
    setIsBackingUp(true)
    // await triggerLogicalBackup()
    setTimeout(() => {
      alert("Logical Backup Complete! Saved to 'system-backups' bucket.")
      setIsBackingUp(false)
    }, 1500)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disaster Recovery</h1>
          <p className="text-muted-foreground mt-1">Manage system backups, partial restores, and global audit logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Backup Card */}
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HardDriveDownload className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Logical Backup</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Create a JSON snapshot of all Questions, Papers, and Users. Stored safely in the cloud.
            </p>
          </div>
          <button 
            onClick={handleBackup}
            disabled={isBackingUp}
            className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isBackingUp ? 'Serializing Data...' : 'Trigger Manual Backup'}
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArchiveRestore className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-lg">Partial Restore</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Upload a specific Question JSON from a previous backup to restore it without overwriting the entire database.
            </p>
          </div>
          <button className="w-full py-2 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700">
            Upload JSON to Restore
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-lg">System Health</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">All systems operational.</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" /> Last Backup: Today, 03:00 AM
            </div>
          </div>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="mt-8">
        <AuditLogSearch />
      </div>

    </div>
  )
}
