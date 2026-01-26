// Backstory question from /v2/backstory/questions
export interface BackstoryQuestion {
  id: number
  title: string
  description: string
  answers: string[]
  order: number
  races?: string[]
  professions?: string[]
}

// Backstory answer from /v2/backstory/answers
export interface BackstoryAnswer {
  id: string
  title: string
  description: string
  journal: string
  question: number
  professions?: string[]
  races?: string[]
}

// Enriched backstory item for rendering
export interface EnrichedBackstoryItem {
  question: BackstoryQuestion
  answer: BackstoryAnswer
}
