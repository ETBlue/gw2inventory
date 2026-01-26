import type {
  BackstoryAnswer,
  BackstoryQuestion,
  EnrichedBackstoryItem,
} from "~/types/backstory"

/**
 * Enriches backstory answer IDs into sorted question/answer pairs
 *
 * @param answerIds - Array of answer ID strings from the character backstory API
 * @param questions - Cached backstory questions keyed by ID
 * @param answers - Cached backstory answers keyed by string ID
 * @returns Sorted array of enriched backstory items (by question.order)
 */
export function enrichBackstory(
  answerIds: string[],
  questions: Record<number, BackstoryQuestion>,
  answers: Record<string, BackstoryAnswer>,
): EnrichedBackstoryItem[] {
  const enriched: EnrichedBackstoryItem[] = []

  for (const answerId of answerIds) {
    const answer = answers[answerId]
    if (!answer) continue

    const question = questions[answer.question]
    if (!question) continue

    enriched.push({ question, answer })
  }

  return enriched.sort((a, b) => a.question.order - b.question.order)
}
