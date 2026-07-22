import { useState } from 'react'

export function Step2Weightage({ initialData, onNext, onBack }: any) {
  const [chapters, setChapters] = useState([
    { name: 'Kinematics', weight: 40 },
    { name: 'Thermodynamics', weight: 60 }
  ])

  const total = chapters.reduce((s, c) => s + c.weight, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Chapter Weightage</h2>
      <p className="text-muted-foreground text-sm">Allocate percentage targets for specific chapters. Total must equal 100%.</p>
      
      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
        {chapters.map((ch, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="w-1/3 font-medium text-sm">{ch.name}</span>
            <input 
              type="range" 
              min="0" max="100" 
              value={ch.weight} 
              onChange={e => {
                const newCh = [...chapters]
                newCh[idx].weight = Number(e.target.value)
                setChapters(newCh)
              }}
              className="flex-1"
            />
            <span className="w-12 text-right font-mono">{ch.weight}%</span>
          </div>
        ))}
      </div>
      
      <div className={`text-sm font-bold text-right ${total === 100 ? 'text-green-600' : 'text-red-500'}`}>
        Total: {total}%
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button onClick={onBack} className="px-6 py-2 border rounded-md hover:bg-accent">Back</button>
        <button 
          onClick={() => onNext({ chapterWeightages: chapters })} 
          disabled={total !== 100}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
        >Next Step</button>
      </div>
    </div>
  )
}
