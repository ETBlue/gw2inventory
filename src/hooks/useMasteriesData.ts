import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useMasteriesQuery } from "~/hooks/useStaticData"
import type { AccountMastery, Mastery } from "~/types/masteries"

export interface MasteryRegionGroup {
  region: string
  tracks: Mastery[]
  unlockedLevels: number
  totalLevels: number
}

export default function useMasteriesData() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data: masteries = [], isLoading: isMasteriesFetching } =
    useMasteriesQuery()

  const {
    data: accountMasteries,
    isLoading: isAccountMasteriesLoading,
    error: accountMasteriesError,
  } = useQuery({
    queryKey: ["account/masteries", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const accountMasteryMap = useMemo(() => {
    if (!accountMasteries) return new Map<number, number>()
    return new Map(
      (accountMasteries as AccountMastery[]).map((m) => [m.id, m.level]),
    )
  }, [accountMasteries])

  const masteriesByRegion = useMemo(() => {
    if (masteries.length === 0) return []

    const regionMap = new Map<string, Mastery[]>()
    for (const mastery of masteries) {
      const tracks = regionMap.get(mastery.region) ?? []
      tracks.push(mastery)
      regionMap.set(mastery.region, tracks)
    }

    const groups: MasteryRegionGroup[] = []
    for (const [region, tracks] of regionMap) {
      const sortedTracks = tracks.sort((a, b) => a.order - b.order)

      let unlockedLevels = 0
      let totalLevels = 0
      for (const track of sortedTracks) {
        totalLevels += track.levels.length
        const accountLevel = accountMasteryMap.get(track.id)
        if (accountLevel !== undefined) {
          unlockedLevels += accountLevel + 1
        }
      }

      groups.push({ region, tracks: sortedTracks, unlockedLevels, totalLevels })
    }

    // Sort regions by the lowest order value among their tracks
    groups.sort((a, b) => a.tracks[0].order - b.tracks[0].order)

    return groups
  }, [masteries, accountMasteryMap])

  return {
    hasToken: !!token,
    masteriesByRegion,
    accountMasteryMap,
    isFetching: isMasteriesFetching || isAccountMasteriesLoading,
    error: accountMasteriesError,
  }
}
