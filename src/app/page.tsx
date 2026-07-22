import Link from "next/link";
import { AdminDashboard } from "@/features/dashboard/components/AdminDashboard";
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  ScanLine, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Zap,
  ArrowRight,
  Database
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              QuestionBank AI
            </span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              Enterprise v1.0
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</a>
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#modules" className="hover:text-indigo-400 transition-colors">Modules</a>
          <a href="#security" className="hover:text-indigo-400 transition-colors">Security</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live & Healthy
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-sm mb-8 shadow-inner">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>Next-Gen Assessment & Question Paper Engineering Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-none mb-6">
          Automate Exam Blueprinting, <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            AI OCR & Paper Generation at Scale
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Enterprise-ready Question Bank system supporting millions of questions, AI-driven OCR digitizer, blueprint balancing engine, and instant PDF/DOCX exports.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#dashboard"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            Launch Platform Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Live Admin Dashboard Component Integration */}
      <section id="dashboard" className="px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-xs font-mono text-slate-400">QuestionBank Control Panel</span>
            </div>
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              Live Production State
            </span>
          </div>

          <div className="p-2 md:p-6 bg-slate-950/40">
            <AdminDashboard />
          </div>
        </div>
      </section>

      {/* Core Platform Modules Grid */}
      <section id="modules" className="px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise Capabilities</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Modular architecture designed for High Schools, Universities, and Competitive Exam Boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Question Bank Repository</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Support for MCQs, Numerical, Subjective, and LaTeX Formulae with full taxonomy tags & metadata.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
              <ScanLine className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI OCR Digitizer</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant PDF/Image question extraction using Mathpix & Document AI with auto-crop & formula parsing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Paper Generator</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Blueprint engine to generate balanced question papers, shuffle answer keys, and export to PDF/DOCX.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Infrastructure Footer */}
      <footer id="security" className="mt-auto border-t border-slate-800/80 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-slate-400">
              Encrypted via Supabase Postgres & Upstash Redis Caching
            </span>
          </div>
          <div className="text-xs text-slate-500">
            © 2026 Question Bank Platform. All Systems Operational.
          </div>
        </div>
      </footer>
    </div>
  );
}

