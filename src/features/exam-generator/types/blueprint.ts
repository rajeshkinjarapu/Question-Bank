export interface ExamBlueprint {
  examId: string
  title: string
  durationMinutes: number
  sections: BlueprintSection[]
}

export interface BlueprintSection {
  id: string
  name: string
  totalQuestions: number
  topicIds: string[]
  difficultyDistribution: {
    easy: number   // percentage, e.g. 30
    medium: number // percentage, e.g. 50
    hard: number   // percentage, e.g. 20
  }
  questionTypeIds: string[]
  customMarks?: {
    positive: number
    negative: number
  }
}

export interface GeneratedPaperDraft {
  blueprint: ExamBlueprint
  sections: {
    sectionName: string
    questions: any[] // Mapped to the questions table schema
  }[]
}
