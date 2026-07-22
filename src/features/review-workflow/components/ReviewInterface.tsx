'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, MessageSquareWarning } from 'lucide-react'
// import { approveQuestion, rejectQuestion } from '../api/workflow'

export function ReviewInterface({ question }: { question: any }) {
  const [comment, setComment] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)

  const handleApprove = async () => {
    // await approveQuestion(question.id)
    alert("Question Approved!")
  }

  const handleReject = async () => {
    if (!comment) return alert("Please provide a reason for rejection.")
    // await rejectQuestion(question.id, comment)
    alert("Question Rejected. Sent back to setter.")
    setIsRejecting(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full max-w-7xl mx-auto p-6">
      
      {/* Left Side: Question Preview */}
      <div className="col-span-2 bg-card border rounded-xl p-8 shadow-sm overflow-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-xl font-bold">Review Question: #{question.id.substring(0, 8)}</h2>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            Pending Review
          </span>
        </div>

        <div className="prose max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: question.statement }} />
        </div>

        <div className="space-y-3 pl-4">
          {question.options.map((opt: any, idx: number) => (
            <div key={idx} className={`p-3 border rounded-lg flex items-start gap-3 ${opt.isCorrect ? 'bg-green-50 border-green-200' : 'bg-background'}`}>
              <span className={`font-bold mt-0.5 ${opt.isCorrect ? 'text-green-700' : 'text-muted-foreground'}`}>
                ({String.fromCharCode(65 + idx)})
              </span>
              <div dangerouslySetInnerHTML={{ __html: opt.content }} />
              {opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Reviewer Actions */}
      <div className="col-span-1 flex flex-col gap-4">
        
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Review Actions</h3>
          
          <div className="space-y-3">
            <button 
              onClick={handleApprove}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" /> Approve Question
            </button>
            
            <button 
              onClick={() => setIsRejecting(!isRejecting)}
              className="w-full py-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <XCircle className="w-5 h-5" /> Request Changes
            </button>
          </div>
        </div>

        {isRejecting && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-amber-800 font-semibold mb-3">
              <MessageSquareWarning className="w-5 h-5" /> Rejection Feedback
            </div>
            <textarea 
              className="flex-1 w-full p-3 text-sm border-amber-200 rounded-md bg-white focus:ring-amber-500 mb-3 resize-none"
              placeholder="Explain what needs to be fixed... (e.g., 'The unit in option B is incorrect.')"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button 
              onClick={handleReject}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md"
            >
              Confirm Rejection
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
