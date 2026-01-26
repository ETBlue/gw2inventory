import { describe, expect, it } from "vitest"

import type { BackstoryAnswer, BackstoryQuestion } from "~/types/backstory"

import { enrichBackstory } from "./backstory"

const mockQuestions: Record<number, BackstoryQuestion> = {
  7: {
    id: 7,
    title: "My Personality",
    description: "Trouble may follow me, but I use my ______...",
    answers: ["7-53", "7-54", "7-55"],
    order: 1,
  },
  10: {
    id: 10,
    title: "Greatest Fear",
    description: "My greatest fear is...",
    answers: ["10-65", "10-66", "10-67"],
    order: 3,
  },
  11: {
    id: 11,
    title: "Biography",
    description: "I was raised as a...",
    answers: ["11-69", "11-70", "11-71", "11-72"],
    order: 2,
  },
}

const mockAnswers: Record<string, BackstoryAnswer> = {
  "7-54": {
    id: "7-54",
    title: "Dignity",
    description: "I'm dignified...",
    journal: "Though trouble may follow me, I overcome it with dignity.",
    question: 7,
  },
  "10-67": {
    id: "10-67",
    title: "Never Drink",
    description: "I never touch alcohol...",
    journal: "My greatest fear is...",
    question: 10,
  },
  "11-72": {
    id: "11-72",
    title: "Street Rat",
    description: "I grew up on the streets...",
    journal: "I was raised as a street rat.",
    question: 11,
  },
}

describe("enrichBackstory", () => {
  it("returns empty array when answerIds is empty", () => {
    const result = enrichBackstory([], mockQuestions, mockAnswers)
    expect(result).toEqual([])
  })

  it("enriches answer IDs into question/answer pairs", () => {
    const result = enrichBackstory(
      ["7-54", "11-72", "10-67"],
      mockQuestions,
      mockAnswers,
    )
    expect(result).toHaveLength(3)
    expect(result[0].question.title).toBe("My Personality")
    expect(result[0].answer.title).toBe("Dignity")
  })

  it("sorts results by question.order", () => {
    const result = enrichBackstory(
      ["10-67", "7-54", "11-72"],
      mockQuestions,
      mockAnswers,
    )
    expect(result.map((r) => r.question.order)).toEqual([1, 2, 3])
  })

  it("skips answer IDs not found in answers cache", () => {
    const result = enrichBackstory(
      ["7-54", "unknown-id"],
      mockQuestions,
      mockAnswers,
    )
    expect(result).toHaveLength(1)
    expect(result[0].answer.id).toBe("7-54")
  })

  it("skips answers whose question is not found in questions cache", () => {
    const orphanAnswers: Record<string, BackstoryAnswer> = {
      ...mockAnswers,
      "999-1": {
        id: "999-1",
        title: "Orphan",
        description: "...",
        journal: "...",
        question: 999,
      },
    }
    const result = enrichBackstory(
      ["7-54", "999-1"],
      mockQuestions,
      orphanAnswers,
    )
    expect(result).toHaveLength(1)
  })
})
