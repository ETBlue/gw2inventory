import { useQuery } from "@tanstack/react-query"
import { sortBy } from "lodash"
import type { MaterialCategory } from "@gw2api/types/data/material"
import { queryFunction } from "helpers/api"
import { materialCategoryAliases } from "contexts/types/ItemContext"

/**
 * Hook for managing material categories from GW2 API
 * Handles fetching, sorting, and aliasing of material categories
 */
export function useMaterialCategories() {
  const { data: materialCategoriesData, isFetching: isMaterialFetching } =
    useQuery({
      queryKey: ["materials", undefined, "ids=all"],
      queryFn: queryFunction,
      staleTime: Infinity,
    })

  // Process material categories data
  const materialCategories = materialCategoriesData
    ? sortBy(materialCategoriesData, ["order"]).map(
        (item: MaterialCategory) => materialCategoryAliases[item.name]
      )
    : []

  // Create materials lookup map for category ID to alias mapping
  const materials = materialCategoriesData?.reduce(
    (prev: Record<number, string>, curr: MaterialCategory) => {
      prev[curr.id] = materialCategoryAliases[curr.name]
      return prev
    },
    {}
  ) || {}

  return {
    materialCategories,
    materials,
    isMaterialFetching,
    materialCategoriesData,
  }
}