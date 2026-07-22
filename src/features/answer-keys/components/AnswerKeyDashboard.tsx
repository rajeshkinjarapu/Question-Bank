'use client'

import { useState } from 'react'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { buildAnswerKey, AnswerKeyRow } from '../utils/aggregator'
import { exportToCsv, downloadCsv } from '../utils/exportCsv'

interface Props {
  generatedSets: any[] // Array of sets from Phase 15
}

export function AnswerKeyDashboard({ generatedSets }: Props) {
  const [activeSetIndex, setActiveSetIndex] = useState(0)

  if (!generatedSets || generatedSets.length === 0) return null

  const activeSet = generatedSets[activeSetIndex]
  
  // Calculate the answer key on the fly for the selected set
  const answerKeyTable: AnswerKeyRow[] = buildAnswerKey(activeSet.questions, activeSet.answerKeyMap)

  const handleExportCsv = () => {
    const csv = exportToCsv(answerKeyTable)
    downloadCsv(csv, `Answer_Key_Set_${activeSet.setName}.csv`)
  }

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Header & Export Toolbar */}
      <div className="p-4 border-b flex justify-between items-center bg-muted/30">
        <h2 className="text-lg font-bold">Answer Keys</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV / Excel
          </button>
          <button 
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Set Tabs */}
      <div className="flex border-b bg-muted/10">
        {generatedSets.map((set, idx) => (
          <button
            key={set.setName}
            onClick={() => setActiveSetIndex(idx)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              idx === activeSetIndex 
                ? 'border-primary text-primary bg-background' 
                : 'border-transparent text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Set {set.setName}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground sticky top-0">
            <tr>
              <th className="p-3 font-semibold rounded-tl-md">Q.No</th>
              <th className="p-3 font-semibold text-center">Correct Answer</th>
              <th className="p-3 font-semibold text-center">Marks</th>
              <th className="p-3 font-semibold">Difficulty</th>
              <th className="p-3 font-semibold">Chapter</th>
              <th className="p-3 font-semibold rounded-tr-md">Topic</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {answerKeyTable.map((row) => (
              <tr key={row.questionId} className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium text-center w-16">{row.questionNumber}</td>
                <td className="p-3">
                  <div className="mx-auto w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {row.correctOptionLetter}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="text-green-600 font-medium">+{row.marks}</span>
                  <span className="text-destructive text-xs ml-1">({row.negativeMarks})</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    row.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {row.difficulty}
                  </span>
                </td>
                <td className="p-3 truncate max-w-[200px]">{row.chapter}</td>
                <td className="p-3 text-muted-foreground truncate max-w-[200px]">{row.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
