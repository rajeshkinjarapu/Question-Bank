import { useState } from 'react'

export function Step1Metadata({ initialData, onNext }: any) {
  const [data, setData] = useState(initialData)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Paper Metadata</h2>
      <p className="text-muted-foreground text-sm">Define the core constraints for your question paper.</p>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Exam</label>
          <select className="w-full border rounded-md p-2">
            <option>JEE Main</option>
            <option>NEET</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select className="w-full border rounded-md p-2">
            <option>Physics</option>
            <option>Chemistry</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Questions</label>
          <select 
            value={data.questionCount}
            onChange={e => setData({...data, questionCount: e.target.value})}
            className="w-full border rounded-md p-2"
          >
            <option value="25">25 Questions</option>
            <option value="50">50 Questions</option>
            <option value="100">100 Questions</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration (Minutes)</label>
          <input 
            type="number" 
            value={data.durationMinutes}
            onChange={e => setData({...data, durationMinutes: Number(e.target.value)})}
            className="w-full border rounded-md p-2" 
          />
        </div>
      </div>
      <div className="flex justify-end pt-6 border-t">
        <button onClick={() => onNext(data)} className="px-6 py-2 bg-primary text-primary-foreground rounded-md">Next Step</button>
      </div>
    </div>
  )
}
