'use client'

import { useState } from 'react'
import { BlueprintFormValues } from '../schema/blueprint'
import { verifyBlueprintFeasibility } from '../api/verify'
import { FeasibilityReportModal } from './FeasibilityReport'

export function BlueprintBuilder() {
  const [data, setData] = useState<Partial<BlueprintFormValues>>({
    name: '',
    totalQuestions: 50,
    constraints: {
      chapters: [],
      difficulty: { easy: 30, medium: 50, hard: 20 }
    }
  })

  const [report, setReport] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      // Mock passing the full valid object
      const result = await verifyBlueprintFeasibility(data as BlueprintFormValues)
      setReport(result)
    } catch (err) {
      console.error(err)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-card border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold">Blueprint Builder</h2>
        <div className="space-x-3">
          <button className="px-4 py-2 border rounded-md hover:bg-accent text-sm">Save Draft</button>
          <button 
            onClick={handleVerify}
            disabled={isVerifying}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
          >
            {isVerifying ? 'Verifying Inventory...' : 'Verify Feasibility'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Col: Metadata & Difficulty */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Blueprint Name</label>
            <input 
              type="text" 
              className="w-full border rounded p-2 text-sm" 
              placeholder="e.g. JEE Main Standard Mock"
              value={data.name}
              onChange={e => setData({...data, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Questions</label>
            <input 
              type="number" 
              className="w-full border rounded p-2 text-sm"
              value={data.totalQuestions}
              onChange={e => setData({...data, totalQuestions: Number(e.target.value)})}
            />
          </div>

          <div className="p-4 border rounded bg-muted/20">
            <h3 className="font-semibold text-sm mb-3">Difficulty Distribution</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Easy %</label>
                <input type="number" value={data.constraints?.difficulty?.easy} className="w-full border rounded p-1 text-sm mt-1" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Medium %</label>
                <input type="number" value={data.constraints?.difficulty?.medium} className="w-full border rounded p-1 text-sm mt-1" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Hard %</label>
                <input type="number" value={data.constraints?.difficulty?.hard} className="w-full border rounded p-1 text-sm mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Chapter Distribution Table */}
        <div className="border rounded p-4">
          <h3 className="font-semibold text-sm mb-3">Chapter Requirements</h3>
          
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-2 text-left">Chapter</th>
                <th className="p-2 text-right">Requirement</th>
                <th className="p-2 w-16">Type</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Rows */}
              <tr className="border-b">
                <td className="p-2">Algebra</td>
                <td className="p-2 text-right"><input type="number" className="w-16 border rounded p-1 text-right" defaultValue={8}/></td>
                <td className="p-2 text-xs text-muted-foreground">Count</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Calculus</td>
                <td className="p-2 text-right"><input type="number" className="w-16 border rounded p-1 text-right" defaultValue={20}/></td>
                <td className="p-2 text-xs text-muted-foreground">%</td>
              </tr>
            </tbody>
          </table>
          <button className="mt-4 text-sm text-primary hover:underline">+ Add Chapter Constraint</button>
        </div>
      </div>

      {report && <FeasibilityReportModal report={report} onClose={() => setReport(null)} />}
    </div>
  )
}
