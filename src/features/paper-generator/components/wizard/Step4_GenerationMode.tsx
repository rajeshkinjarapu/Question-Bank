import { useState } from 'react'
import { Sparkles, Dice5, FileEdit, FileJson } from 'lucide-react'

export function Step4GenerationMode({ initialData, onGenerate, onBack }: any) {
  const [mode, setMode] = useState(initialData.mode || 'random')

  const modes = [
    { id: 'random', icon: Dice5, title: 'Random Generation', desc: 'Instantly pulls questions matching your criteria.' },
    { id: 'manual', icon: FileEdit, title: 'Manual Selection', desc: 'Opens the builder to drag and drop specific questions.' },
    { id: 'blueprint', icon: FileJson, title: 'Blueprint Based', desc: 'Follows a strict pre-defined JSON blueprint structure.' },
    { id: 'ai_suggested', icon: Sparkles, title: 'AI Suggested', desc: 'Let the LLM balance the difficulty and topics perfectly.' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Generation Mode</h2>
      <p className="text-muted-foreground text-sm">How would you like the engine to compile this paper?</p>
      
      <div className="grid grid-cols-2 gap-4">
        {modes.map(m => {
          const Icon = m.icon
          const isActive = mode === m.id
          return (
            <div 
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                isActive ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <Icon className={`w-6 h-6 mb-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="font-semibold text-sm mb-1">{m.title}</h3>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          )
        })}
      </div>
      
      <div className="flex justify-between pt-6 border-t">
        <button onClick={onBack} className="px-6 py-2 border rounded-md hover:bg-accent">Back</button>
        <button 
          onClick={() => onGenerate({ mode })} 
          className="px-8 py-2 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 shadow-md"
        >Generate Paper</button>
      </div>
    </div>
  )
}
