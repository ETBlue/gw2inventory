# Character Backstory Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display each character's backstory question/answer pairs in the expandable row on the Characters page.

**Architecture:** Three-layer data flow matching existing patterns: (1) per-character backstory answer IDs prefetched via `useQueries()` in CharacterContext, (2) static backstory questions and answers cached in StaticDataContext with localStorage persistence, (3) pure helper function enriches answer IDs into sorted `{ question, answer }` pairs for rendering.

**Tech Stack:** TypeScript, React 19, Chakra UI v2.10, @tanstack/react-query, Vitest

---

### Task 1: Add backstory type definitions

**Files:**

- Create: `src/types/backstory.ts`

**Step 1: Create type definitions**

`@gw2api/types` has no backstory types, so we define our own. Follow the pattern in `src/types/specializations.ts`.

```typescript
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
```

**Step 2: Commit**

```bash
git add src/types/backstory.ts
git commit -m "feat(backstory): add backstory type definitions"
```

---

### Task 2: Add backstory enrichment helper with tests

**Files:**

- Create: `src/helpers/backstory.ts`
- Create: `src/helpers/backstory.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, expect, it } from "vitest"

import type {
  BackstoryAnswer,
  BackstoryQuestion,
  EnrichedBackstoryItem,
} from "~/types/backstory"

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
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/helpers/backstory.test.ts`
Expected: FAIL (module not found)

**Step 3: Write the implementation**

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/helpers/backstory.test.ts`
Expected: All 5 tests PASS

**Step 5: Commit**

```bash
git add src/helpers/backstory.ts src/helpers/backstory.test.ts
git commit -m "feat(backstory): add backstory enrichment helper with tests"
```

---

### Task 3: Add backstory static data to StaticDataContext

**Files:**

- Modify: `src/contexts/StaticDataContext.tsx`

This task adds backstory questions and answers to the static data cache, following the exact same pattern as specializations/traits. The changes are spread across multiple sections of the file:

**Step 1: Add imports and storage keys**

At the top of the file, add the import for backstory types:

```typescript
import type { BackstoryAnswer, BackstoryQuestion } from "~/types/backstory"
```

Add to `STORAGE_KEYS`:

```typescript
BACKSTORY_QUESTIONS: "gw2inventory_static_backstory_questions",
BACKSTORY_ANSWERS: "gw2inventory_static_backstory_answers",
```

**Step 2: Add to `cacheUtils.loadStaticData()`**

Add to the return type and the empty return and the data loading:

```typescript
backstoryQuestions: Record<number, BackstoryQuestion>
backstoryAnswers: Record<string, BackstoryAnswer>
```

Empty return adds:

```typescript
backstoryQuestions: {},
backstoryAnswers: {},
```

Data loading adds:

```typescript
const backstoryQuestions =
  this.load<Record<number, BackstoryQuestion>>(
    STORAGE_KEYS.BACKSTORY_QUESTIONS,
  ) || {}
const backstoryAnswers =
  this.load<Record<string, BackstoryAnswer>>(STORAGE_KEYS.BACKSTORY_ANSWERS) ||
  {}
```

**Step 3: Add save functions to `cacheUtils`**

```typescript
saveBackstoryQuestions(questions: Record<number, BackstoryQuestion>): void {
  this.save(STORAGE_KEYS.BACKSTORY_QUESTIONS, questions)
},

saveBackstoryAnswers(answers: Record<string, BackstoryAnswer>): void {
  this.save(STORAGE_KEYS.BACKSTORY_ANSWERS, answers)
},
```

**Step 4: Add to `getCacheInfo()`**

Add loading and count:

```typescript
const backstoryQuestions =
  this.load<Record<number, BackstoryQuestion>>(
    STORAGE_KEYS.BACKSTORY_QUESTIONS,
  ) || {}
const backstoryAnswers =
  this.load<Record<string, BackstoryAnswer>>(STORAGE_KEYS.BACKSTORY_ANSWERS) ||
  {}
```

Add to return:

```typescript
backstoryQuestionCount: Object.keys(backstoryQuestions).length,
backstoryAnswerCount: Object.keys(backstoryAnswers).length,
```

**Step 5: Add to state type and reducer actions**

`StaticDataState` adds:

```typescript
backstoryQuestions: Record<number, BackstoryQuestion>
isBackstoryQuestionsFetching: boolean
backstoryAnswers: Record<string, BackstoryAnswer>
isBackstoryAnswersFetching: boolean
```

`StaticDataAction` adds:

```typescript
| { type: "ADD_BACKSTORY_QUESTIONS"; questions: BackstoryQuestion[] }
| { type: "SET_BACKSTORY_QUESTIONS_FETCHING"; fetching: boolean }
| { type: "LOAD_CACHED_BACKSTORY_QUESTIONS"; questions: Record<number, BackstoryQuestion> }
| { type: "ADD_BACKSTORY_ANSWERS"; answers: BackstoryAnswer[] }
| { type: "SET_BACKSTORY_ANSWERS_FETCHING"; fetching: boolean }
| { type: "LOAD_CACHED_BACKSTORY_ANSWERS"; answers: Record<string, BackstoryAnswer> }
```

**Step 6: Add reducer cases**

```typescript
case "ADD_BACKSTORY_QUESTIONS":
  return {
    ...state,
    backstoryQuestions: {
      ...state.backstoryQuestions,
      ...action.questions.reduce(
        (acc, q) => { acc[q.id] = q; return acc },
        {} as Record<number, BackstoryQuestion>,
      ),
    },
  }
case "SET_BACKSTORY_QUESTIONS_FETCHING":
  return { ...state, isBackstoryQuestionsFetching: action.fetching }
case "LOAD_CACHED_BACKSTORY_QUESTIONS":
  return { ...state, backstoryQuestions: action.questions }
case "ADD_BACKSTORY_ANSWERS":
  return {
    ...state,
    backstoryAnswers: {
      ...state.backstoryAnswers,
      ...action.answers.reduce(
        (acc, a) => { acc[a.id] = a; return acc },
        {} as Record<string, BackstoryAnswer>,
      ),
    },
  }
case "SET_BACKSTORY_ANSWERS_FETCHING":
  return { ...state, isBackstoryAnswersFetching: action.fetching }
case "LOAD_CACHED_BACKSTORY_ANSWERS":
  return { ...state, backstoryAnswers: action.answers }
```

**Step 7: Add to initial state in `useReducer`**

```typescript
backstoryQuestions: cachedData.backstoryQuestions,
isBackstoryQuestionsFetching: false,
backstoryAnswers: cachedData.backstoryAnswers,
isBackstoryAnswersFetching: false,
```

**Step 8: Add fetch functions**

Follow exact pattern of `fetchAllTraits` (complete dataset fetch):

```typescript
const fetchBackstoryQuestions = useCallback(async () => {
  if (
    Object.keys(state.backstoryQuestions).length > 0 ||
    state.isBackstoryQuestionsFetching
  )
    return
  dispatch({ type: "SET_BACKSTORY_QUESTIONS_FETCHING", fetching: true })
  try {
    const data = await fetchGW2<BackstoryQuestion[]>(
      "backstory/questions",
      "ids=all",
    )
    if (data) {
      dispatch({ type: "ADD_BACKSTORY_QUESTIONS", questions: data })
      const record = data.reduce(
        (acc, q) => {
          acc[q.id] = q
          return acc
        },
        {} as Record<number, BackstoryQuestion>,
      )
      cacheUtils.saveBackstoryQuestions(record)
    }
  } catch (error) {
    console.error("Failed to fetch backstory questions:", error)
  } finally {
    dispatch({ type: "SET_BACKSTORY_QUESTIONS_FETCHING", fetching: false })
  }
}, [state.backstoryQuestions, state.isBackstoryQuestionsFetching])

const fetchBackstoryAnswers = useCallback(async () => {
  if (
    Object.keys(state.backstoryAnswers).length > 0 ||
    state.isBackstoryAnswersFetching
  )
    return
  dispatch({ type: "SET_BACKSTORY_ANSWERS_FETCHING", fetching: true })
  try {
    const data = await fetchGW2<BackstoryAnswer[]>(
      "backstory/answers",
      "ids=all",
    )
    if (data) {
      dispatch({ type: "ADD_BACKSTORY_ANSWERS", answers: data })
      const record = data.reduce(
        (acc, a) => {
          acc[a.id] = a
          return acc
        },
        {} as Record<string, BackstoryAnswer>,
      )
      cacheUtils.saveBackstoryAnswers(record)
    }
  } catch (error) {
    console.error("Failed to fetch backstory answers:", error)
  } finally {
    dispatch({ type: "SET_BACKSTORY_ANSWERS_FETCHING", fetching: false })
  }
}, [state.backstoryAnswers, state.isBackstoryAnswersFetching])
```

**Step 9: Add auto-fetch useEffects**

```typescript
useEffect(() => {
  if (
    Object.keys(state.backstoryQuestions).length === 0 &&
    !state.isBackstoryQuestionsFetching
  ) {
    fetchBackstoryQuestions()
  }
}, [
  state.backstoryQuestions,
  state.isBackstoryQuestionsFetching,
  fetchBackstoryQuestions,
])

useEffect(() => {
  if (
    Object.keys(state.backstoryAnswers).length === 0 &&
    !state.isBackstoryAnswersFetching
  ) {
    fetchBackstoryAnswers()
  }
}, [
  state.backstoryAnswers,
  state.isBackstoryAnswersFetching,
  fetchBackstoryAnswers,
])
```

**Step 10: Add to context type and context value**

`StaticDataContextType` adds:

```typescript
backstoryQuestions: Record<number, BackstoryQuestion>
isBackstoryQuestionsFetching: boolean
backstoryAnswers: Record<string, BackstoryAnswer>
isBackstoryAnswersFetching: boolean
```

`contextValue` adds:

```typescript
backstoryQuestions: state.backstoryQuestions,
isBackstoryQuestionsFetching: state.isBackstoryQuestionsFetching,
backstoryAnswers: state.backstoryAnswers,
isBackstoryAnswersFetching: state.isBackstoryAnswersFetching,
```

Also add to `useMemo` dependency array:

```typescript
state.backstoryQuestions,
state.isBackstoryQuestionsFetching,
state.backstoryAnswers,
state.isBackstoryAnswersFetching,
```

**Step 11: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 12: Commit**

```bash
git add src/contexts/StaticDataContext.tsx
git commit -m "feat(backstory): add backstory questions and answers to static data cache"
```

---

### Task 4: Add backstory prefetching to CharacterContext

**Files:**

- Modify: `src/contexts/CharacterContext.tsx`

**Step 1: Add backstory prefetching**

Follow the exact same pattern as `specsResults`. Add a second `useQueries()` call for backstory data.

Import enrichment helper and types:

```typescript
import { enrichBackstory } from "~/helpers/backstory"
import type {
  BackstoryAnswer,
  BackstoryQuestion,
  EnrichedBackstoryItem,
} from "~/types/backstory"
```

Add to context:

```typescript
// Add to StaticDataContext usage
const { specializations, traits, backstoryQuestions, backstoryAnswers } =
  useStaticData()
```

Add `useQueries` for backstory (after specsResults):

```typescript
const backstoryResults = useQueries({
  queries: characterNames.map((characterName) => ({
    queryKey: ["characterBackstory", characterName, token] as const,
    queryFn: async () => {
      if (!token) return null
      const data = await fetchGW2<{ backstory: string[] }>(
        `characters/${encodeURIComponent(characterName)}/backstory`,
        `access_token=${token}`,
      )
      return data?.backstory ?? null
    },
    staleTime: Infinity,
    enabled: !!token,
  })),
})
```

Add lookup helper (after specsResults helpers):

```typescript
const getCharacterBackstory = useCallback(
  (characterName: string): string[] | null => {
    const index = characterNameToIndex.get(characterName)
    if (index === undefined) return null
    return backstoryResults[index]?.data ?? null
  },
  [characterNameToIndex, backstoryResults],
)

const getEnrichedBackstory = useCallback(
  (characterName: string): EnrichedBackstoryItem[] => {
    const answerIds = getCharacterBackstory(characterName)
    if (!answerIds) return []
    return enrichBackstory(answerIds, backstoryQuestions, backstoryAnswers)
  },
  [getCharacterBackstory, backstoryQuestions, backstoryAnswers],
)

const isBackstoryLoading = useCallback(
  (characterName: string): boolean => {
    const index = characterNameToIndex.get(characterName)
    if (index === undefined) return false
    return backstoryResults[index]?.isPending ?? false
  },
  [characterNameToIndex, backstoryResults],
)
```

**Step 2: Update context type**

Add to `CharacterContextType`:

```typescript
/** Get cached backstory answer IDs for a character */
getCharacterBackstory: (characterName: string) => string[] | null
/** Get enriched backstory items for a character */
getEnrichedBackstory: (characterName: string) => EnrichedBackstoryItem[]
/** Check if a character's backstory is currently loading */
isBackstoryLoading: (characterName: string) => boolean
```

Add defaults:

```typescript
getCharacterBackstory: () => null,
getEnrichedBackstory: () => [],
isBackstoryLoading: () => false,
```

Add to provider value:

```typescript
getCharacterBackstory,
getEnrichedBackstory,
isBackstoryLoading,
```

**Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 4: Commit**

```bash
git add src/contexts/CharacterContext.tsx
git commit -m "feat(backstory): add backstory prefetching to CharacterContext"
```

---

### Task 5: Create CharacterBackstory component

**Files:**

- Create: `src/pages/characters/CharacterBackstory.tsx`

**Step 1: Create the component**

```tsx
import React from "react"

import { Box, Flex, Text } from "@chakra-ui/react"

import { useCharacters } from "~/contexts/CharacterContext"

interface CharacterBackstoryProps {
  characterName: string
}

/**
 * Displays backstory question/answer pairs for a character in an expanded row
 * Uses inline flex layout matching the tablet-only hidden columns pattern
 */
export function CharacterBackstory({
  characterName,
}: CharacterBackstoryProps): React.JSX.Element | null {
  const { getEnrichedBackstory, isBackstoryLoading } = useCharacters()

  const loading = isBackstoryLoading(characterName)
  const enrichedBackstory = getEnrichedBackstory(characterName)

  if (loading || enrichedBackstory.length === 0) {
    return null
  }

  return (
    <Box p={3} borderBottom="1px solid" borderColor="gray.300">
      <Flex columnGap="2rem" fontSize="sm" flexWrap="wrap">
        {enrichedBackstory.map((item) => (
          <Box key={item.answer.id}>
            <Text color="gray.500" fontSize="xs">
              {item.question.title}
            </Text>
            <Text>{item.answer.title}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

export default CharacterBackstory
```

**Step 2: Commit**

```bash
git add src/pages/characters/CharacterBackstory.tsx
git commit -m "feat(backstory): add CharacterBackstory component"
```

---

### Task 6: Integrate CharacterBackstory into Characters page

**Files:**

- Modify: `src/pages/characters/Characters.tsx`

**Step 1: Add import**

```typescript
import { CharacterBackstory } from "~/pages/characters/CharacterBackstory"
```

**Step 2: Add component between tablet-only section and CharacterSpecializations**

In the expanded row section (around line 471-472), insert `<CharacterBackstory>` between the closing `</Box>` of the tablet-only section and `<CharacterSpecializations>`:

```tsx
                          </Box>
                          <CharacterBackstory characterName={row.name} />
                          <CharacterSpecializations characterName={row.name} />
```

**Step 3: Run quality pipeline**

Run: `npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build`
Expected: All pass

**Step 4: Commit**

```bash
git add src/pages/characters/Characters.tsx
git commit -m "feat(backstory): integrate backstory display into character expanded row"
```

---

### Task 7: Update documentation

**Files:**

- Modify: `docs/architecture.md`
- Modify: `docs/recent-changes.md`

**Step 1: Update architecture.md**

Update the CharacterContext description to mention backstory prefetching. Update the StaticDataContext description to include backstory questions and answers.

**Step 2: Update recent-changes.md**

Add entry for the backstory feature with timestamp.

**Step 3: Commit**

```bash
git add docs/architecture.md docs/recent-changes.md
git commit -m "docs: update architecture and recent changes for backstory feature"
```
