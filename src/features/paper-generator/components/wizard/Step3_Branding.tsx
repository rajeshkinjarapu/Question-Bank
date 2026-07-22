import { useState } from 'react'

export function Step3Branding({ initialData, onNext, onBack }: any) {
  const [data, setData] = useState(initialData)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Branding & Formatting</h2>
      <p className="text-muted-foreground text-sm">Customize how the final PDF will look.</p>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">General Instructions</label>
          <textarea 
            rows={3} 
            className="w-full border rounded-md p-2 text-sm"
            placeholder="e.g. All questions are compulsory. No negative marking."
            defaultValue="Attempt all questions."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Header Text</label>
          <input type="text" className="w-full border rounded-md p-2" defaultValue="JY School Preliminary Exam" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Footer Text</label>
          <input type="text" className="w-full border rounded-md p-2" defaultValue="Confidential" />
        </div>
        
        <div className="col-span-2 space-y-3 pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.shuffleQuestions} 
              onChange={e => setData({...data, shuffleQuestions: e.target.checked})} 
              className="rounded"
            />
            <span className="text-sm font-medium">Randomize Question Order (Creates unique Set A/B/C)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.shuffleOptions} 
              onChange={e => setData({...data, shuffleOptions: e.target.checked})} 
              className="rounded"
            />
            <span className="text-sm font-medium">Randomize Option Order inside MCQs</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-between pt-6 border-t">
        <button onClick={onBack} className="px-6 py-2 border rounded-md hover:bg-accent">Back</button>
        <button onClick={() => onNext(data)} className="px-6 py-2 bg-primary text-primary-foreground rounded-md">Next Step</button>
      </div>
    </div>
  )
}
