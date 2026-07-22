'use client'

import { useState } from 'react'
import { Shield, UserX, KeyRound, Clock, Search } from 'lucide-react'

// Dummy data for presentation
const mockUsers = [
  { id: '1', email: 'principal@school.edu', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: '2', email: 'math.hod@school.edu', role: 'Admin', status: 'Active', lastLogin: '1 hr ago' },
  { id: '3', email: 'physics.teacher@school.edu', role: 'Question Setter', status: 'Active', lastLogin: '3 hrs ago' },
  { id: '4', email: 'chemistry.guest@school.edu', role: 'Viewer', status: 'Suspended', lastLogin: '5 days ago' }
]

export function UserManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Access Control</h1>
          <p className="text-muted-foreground mt-1">Manage users, enforce RBAC roles, and review audit logs.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Add New User
        </button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b flex gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users by email..." 
              className="pl-9 pr-4 py-2 w-full border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">User Email</th>
                <th className="p-4 font-semibold">Assigned Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Last Login</th>
                <th className="p-4 font-semibold text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockUsers.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                      user.role === 'Admin' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {user.lastLogin}
                  </td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button className="p-2 text-amber-600 hover:bg-amber-100 rounded-md transition-colors" title="Reset Password">
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Suspend User">
                      <UserX className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
