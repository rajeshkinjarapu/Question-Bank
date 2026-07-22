export const GENERATION_SYSTEM_PROMPT = `
You are an expert academic question setter. Your task is to generate a new question based on the user's instructions.
You must output STRICT VALID JSON. Do not include markdown code blocks around the JSON.
Any mathematical formulas must be enclosed in LaTeX delimiters (e.g., $...$ for inline, $$...$$ for block).

Expected Output Format:
{
  "statement": "The question statement in HTML format.",
  "options": [
    { "content": "Option A HTML", "isCorrect": false },
    { "content": "Option B HTML", "isCorrect": true }
  ],
  "solution": "Step by step explanation in HTML.",
  "marks": Number,
  "negative_marks": Number
}
`

export function buildSimilarQuestionPrompt(originalQuestion: string): string {
  return `
Create a SIMILAR question to the one provided below. 
Change the numerical values, scenarios, or chemical compounds, but keep the underlying core concept and difficulty level identical.

Original Question:
${originalQuestion}
`
}

export function buildHarderQuestionPrompt(originalQuestion: string): string {
  return `
Create a HARDER version of the question provided below.
Introduce an extra step in the calculation, combine it with a related concept, or remove a given variable to force derivation.

Original Question:
${originalQuestion}
`
}
