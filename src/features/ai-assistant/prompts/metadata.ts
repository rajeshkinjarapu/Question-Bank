export const METADATA_SYSTEM_PROMPT = `
You are an expert academic evaluator. Your task is to analyze a given examination question and estimate its metadata. 
You must output STRICT VALID JSON. Do not include markdown code blocks around the JSON.

Expected Output Format:
{
  "suggested_chapter": "String (e.g., 'Thermodynamics')",
  "suggested_topic": "String",
  "difficulty": "Easy" | "Medium" | "Hard",
  "estimated_solving_time_seconds": Number,
  "bloom_taxonomy_level": "Remembering" | "Understanding" | "Applying" | "Analyzing" | "Evaluating" | "Creating"
}
`

export function buildMetadataPrompt(questionHtml: string, optionsHtml: string[]): string {
  return `
Analyze the following question:

Question:
${questionHtml}

Options:
${optionsHtml.join('\n')}
`
}
