import { Suspense } from 'react'
import { Database, FileText, Users, Cpu, FileUp, Download } from 'lucide-react'
import { getDashboardMetrics, getChartData } from '../api/metrics'
import { StatCard } from './StatCard'
import { ChartsView } from './ChartsView'

export async function AdminDashboard() {
  const [metrics, chartData] = await Promise.all([
    getDashboardMetrics(),
    getChartData()
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your Question Paper Generator platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 flex items-center gap-2">
            <FileUp className="w-4 h-4" /> Import PDF
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Generate Paper
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Questions" 
          value={metrics.totalQuestions.toLocaleString()} 
          icon={<Database className="w-5 h-5" />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Papers Generated" 
          value={metrics.totalPapers.toLocaleString()} 
          icon={<FileText className="w-5 h-5" />} 
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard 
          title="Active Users" 
          value={metrics.activeUsers.toLocaleString()} 
          icon={<Users className="w-5 h-5" />} 
        />
        <StatCard 
          title="AI / OCR Jobs" 
          value={metrics.ocrJobs.toLocaleString()} 
          icon={<Cpu className="w-5 h-5" />} 
        />
      </div>

      {/* Charts Section */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center border rounded-xl text-muted-foreground">Loading Analytics...</div>}>
        <ChartsView data={chartData} />
      </Suspense>

    </div>
  )
}
