export interface Material {
  id: number // The category id.
  name: string // The category name.
  items: number[] // The ids of the items in this category.
  order: number // The order in which the category appears in the material storage.
}
