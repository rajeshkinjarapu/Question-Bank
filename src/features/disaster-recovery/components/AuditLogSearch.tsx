'use client'

import { useState } from 'react'
import { Search, Filter, ShieldAlert } from 'lucide-react'

// Dummy logs for presentation
const mockLogs = [
  { id: '1', user: 'principal@school.edu', action: 'LOGIN', ip: '192.168.1.5', time: '10 mins ago' },
  { id: '2', user: 'math.hod@school.edu', action: 'EXPORT_PDF', ip: '203.0.113.42', time: '1 hr ago' },
  { id: '3', user: 'physics.teacher@school.edu', action: 'DELETE_QUESTION', ip: '198.51.100.12', time: '3 hrs ago' },
  { id: '4', user: 'System', action: 'AI_REQUEST', ip: 'internal', time: '4 hrs ago' }
]

export function AuditLogSearch() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
      
      <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-primary" /> Audit Trail</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search IP, User, or Action..." 
              className="pl-9 pr-4 py-1.5 w-64 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border rounded-md hover:bg-muted"><Filter className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground sticky top-0">
            <tr>
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockLogs.map(log => (
              <tr key={log.id} className="hover:bg-muted/30">
                <td className="p-4 text-muted-foreground">{log.time}</td>
                <td className="p-4 font-medium">{log.user}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-mono border ${
                    log.action.includes('DELETE') ? 'bg-red-50 text-red-600 border-red-200' :
                    log.action.includes('EXPORT') ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
