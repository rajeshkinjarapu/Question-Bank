export type OcrStatus = 'idle' | 'uploading' | 'processing' | 'preview' | 'error' | 'success'

export interface OcrResult {
  rawLatex: string
  rawText: string
  questions: ExtractedQuestion[]
  confidenceScore: number
  engineUsed: 'mathpix' | 'document-ai'
}

export interface ExtractedQuestion {
  id: string
  content: string // LaTeX or markdown
  options?: string[]
  images?: string[]
  tables?: string[]
  pageNumber?: number
}
