'use server'

import { createClient } from '@/lib/supabase/server'
import { withPermission } from '../../users/api/auth-middleware'
import { logUserActivity } from '../../users/api/audit'

/**
 * Triggers a logical backup of the critical database tables.
 * This serializes the data into JSON and pushes it to a secure storage bucket.
 */
export async function triggerLogicalBackup() {
  return withPermission('manage_users', async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Fetch all critical data
    const { data: questions } = await supabase.from('questions').select('*')
    const { data: papers } = await supabase.from('generated_papers').select('*')
    const { data: users } = await supabase.from('profiles').select('*')

    // 2. Serialize to JSON string
    const backupPayload = JSON.stringify({
      timestamp: new Date().toISOString(),
      data: { questions, papers, users }
    })

    // 3. Convert to buffer (in a real app, you would zip this using 'archiver' or 'zlib')
    const buffer = Buffer.from(backupPayload, 'utf-8')
    const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`

    // 4. Upload to the secure 'system-backups' bucket
    const { error } = await supabase.storage.from('system-backups').upload(filename, buffer, {
      contentType: 'application/json'
    })

    if (error) throw new Error(`Backup failed: ${error.message}`)

    // 5. Audit Log
    await logUserActivity({
      userId: user!.id,
      actionType: 'EXPORT_PDF', // Reusing an enum for demo, ideally 'SYSTEM_BACKUP'
      entityType: 'paper',
      entityId: filename
    })

    return { success: true, filename }
  })
}
