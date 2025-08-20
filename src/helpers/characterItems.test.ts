import { describe, it, expect } from "vitest"
import { processCharacterItems } from "./characterItems"

describe("processCharacterItems", () => {
  it("returns empty array when characters is null", () => {
    const result = processCharacterItems(null)
    expect(result).toEqual([])
  })

  it("returns empty array when characters is undefined", () => {
    const result = processCharacterItems(undefined)
    expect(result).toEqual([])
  })

  it("returns empty array when characters array is empty", () => {
    const result = processCharacterItems([])
    expect(result).toEqual([])
  })

  it("processes character bags and equipment correctly", () => {
    const characters = [
      {
        name: "TestChar",
        profession: "Elementalist",
        bags: [
          {
            id: 123,
            size: 20,
            inventory: [
              { id: 456, count: 1 },
              { id: 789, count: 5 },
              null,
              { id: 456, count: 2 },
            ],
          },
        ],
        equipment: [{ id: 101, slot: "Helm" }],
      },
    ] as any[]

    const result = processCharacterItems(characters)

    expect(result).toHaveLength(5) // 1 bag + 3 bag items + 1 equipment

    // Check bag item
    const bagItem = result.find((item) => item.id === 123)
    expect(bagItem).toMatchObject({
      id: 123,
      size: 20,
      location: "TestChar",
      isEquipped: true,
    })

    // Check equipment item
    const helmItem = result.find((item) => item.id === 101)
    expect(helmItem).toMatchObject({
      id: 101,
      slot: "Helm",
      location: "TestChar",
      isEquipped: true,
    })
  })

  it("handles null bags gracefully", () => {
    const characters = [
      {
        name: "TestChar",
        profession: "Elementalist",
        bags: [null, { id: 123, size: 10, inventory: [] }],
        equipment: [],
      },
    ] as any[]

    const result = processCharacterItems(characters)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(123)
  })

  it("filters out null items from bag inventory", () => {
    const characters = [
      {
        name: "TestChar",
        profession: "Elementalist",
        bags: [
          {
            id: 123,
            size: 5,
            inventory: [
              { id: 456, count: 1 },
              null,
              null,
              { id: 789, count: 2 },
            ],
          },
        ],
        equipment: [],
      },
    ] as any[]

    const result = processCharacterItems(characters)

    expect(result).toHaveLength(3) // 1 bag + 2 non-null inventory items

    const inventoryItems = result.filter((item) => !("size" in item))
    expect(inventoryItems).toHaveLength(2)
    expect(inventoryItems.map((item) => item.id)).toEqual([456, 789])
  })

  it("processes multiple characters correctly", () => {
    const characters = [
      {
        name: "Char1",
        profession: "Elementalist",
        bags: [{ id: 100, size: 10, inventory: [{ id: 200, count: 1 }] }],
        equipment: [{ id: 300, slot: "Helm" }],
      },
      {
        name: "Char2",
        profession: "Guardian",
        bags: [{ id: 101, size: 10, inventory: [{ id: 201, count: 2 }] }],
        equipment: [{ id: 301, slot: "Helm" }],
      },
    ] as any[]

    const result = processCharacterItems(characters)

    expect(result).toHaveLength(6) // 2 bags + 2 bag items + 2 equipment

    const char1Items = result.filter((item) => item.location === "Char1")
    const char2Items = result.filter((item) => item.location === "Char2")

    expect(char1Items).toHaveLength(3)
    expect(char2Items).toHaveLength(3)
  })

  it("handles characters with empty bags and equipment", () => {
    const characters = [
      {
        name: "EmptyChar",
        profession: "Thief",
        bags: [],
        equipment: [],
      },
    ] as any[]

    const result = processCharacterItems(characters)
    expect(result).toEqual([])
  })

  it("handles characters with undefined bags and equipment", () => {
    const characters = [
      {
        name: "UndefinedChar",
        profession: "Ranger",
        bags: undefined,
        equipment: undefined,
      },
    ] as any[]

    const result = processCharacterItems(characters)
    expect(result).toEqual([])
  })
})
