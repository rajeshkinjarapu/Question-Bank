'use client'

import { useState, useEffect } from 'react'
import { FileSpreadsheet, Download, Activity, Database, Users } from 'lucide-react'
import { DataGrid } from './DataGrid'
import { getUserProductivityReport, UserProductivityRow } from '../api/productivity'

type ReportType = 'inventory' | 'productivity' | 'usage' | 'system'

export function ReportsDashboard() {
  const [activeReport, setActiveReport] = useState<ReportType>('productivity')
  const [productivityData, setProductivityData] = useState<UserProductivityRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would dynamically fetch based on activeReport
    if (activeReport === 'productivity') {
      setIsLoading(true)
      getUserProductivityReport().then(data => {
        setProductivityData(data)
        setIsLoading(false)
      })
    }
  }, [activeReport])

  const handleExport = () => {
    // Hooks into Phase 20's exportCsv function
    alert(`Exporting ${activeReport} report to CSV/Excel...`)
  }

  const columns = [
    { header: 'Staff Member', accessor: 'userName' },
    { header: 'Questions Created', accessor: 'questionsCreated', isNumeric: true },
    { header: 'Questions Approved', accessor: 'questionsApproved', isNumeric: true },
    { header: 'Questions Rejected', accessor: 'questionsRejected', isNumeric: true }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto flex gap-8 h-full">
      
      {/* Sidebar Navigation */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-4">Reports Center</h2>
        
        <button 
          onClick={() => setActiveReport('inventory')}
          className={`px-4 py-3 text-left rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeReport === 'inventory' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
        >
          <Database className="w-4 h-4" /> Inventory Stats
        </button>
        
        <button 
          onClick={() => setActiveReport('productivity')}
          className={`px-4 py-3 text-left rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeReport === 'productivity' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
        >
          <Users className="w-4 h-4" /> User Productivity
        </button>

        <button 
          onClick={() => setActiveReport('usage')}
          className={`px-4 py-3 text-left rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeReport === 'usage' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
        >
          <Activity className="w-4 h-4" /> Usage & Duplicates
        </button>
      </div>

      {/* Main Report Area */}
      <div className="flex-1 bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-muted/20">
          <div>
            <h3 className="text-lg font-bold capitalize">{activeReport} Report</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {activeReport === 'productivity' && 'Analyze staff contributions and review volumes.'}
            </p>
          </div>
          
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Data
          </button>
        </div>

        {/* Data Grid Area */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">Generating report...</div>
          ) : (
            <DataGrid columns={columns} data={productivityData} />
          )}
        </div>

      </div>
    </div>
  )
}
