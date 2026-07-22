import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: number; isPositive: boolean }
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          {icon}
        </div>
      </div>
      
      <div className="mt-auto">
        <p className="text-3xl font-bold">{value}</p>
        
        {trend && (
          <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${
            trend.isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </p>
        )}
      </div>
    </div>
  )
}
