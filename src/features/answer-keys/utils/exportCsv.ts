import { AnswerKeyRow } from './aggregator'

/**
 * Generates a clean, escaped CSV string from the Answer Key data.
 */
export function exportToCsv(data: AnswerKeyRow[]): string {
  // Headers
  const headers = [
    'Q.No', 
    'Correct Answer', 
    'Marks', 
    'Negative Marks', 
    'Difficulty', 
    'Chapter', 
    'Topic'
  ]

  const rows = [headers.join(',')]

  // Data Rows
  data.forEach(row => {
    const rowData = [
      row.questionNumber,
      row.correctOptionLetter,
      row.marks,
      row.negativeMarks,
      escapeCsv(row.difficulty),
      escapeCsv(row.chapter),
      escapeCsv(row.topic)
    ]
    rows.push(rowData.join(','))
  })

  return rows.join('\n')
}

// Helper to safely wrap fields containing commas in quotes
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Triggers a browser download of the CSV string.
 */
export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
