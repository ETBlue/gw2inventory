import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useMountSkinsQuery } from "~/hooks/useStaticData"
import { AccountMountSkins } from "~/types/mounts"

export const useMountSkins = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: mountSkins = {}, isLoading: isMountSkinsFetching } =
    useMountSkinsQuery()

  const {
    data: accountMountSkinIds,
    isFetching: isAccountMountSkinsFetching,
    error: accountMountSkinsError,
  } = useQuery<AccountMountSkins>({
    queryKey: ["account/mounts/skins", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const accountMountSkins = useMemo(() => {
    if (!accountMountSkinIds) return undefined

    const skinList = accountMountSkinIds
      .map((skinId) => mountSkins[skinId])
      .filter((skin) => skin !== undefined)

    if (skinList.length === 0) return undefined

    return skinList.sort((a, b) => a.name.localeCompare(b.name))
  }, [accountMountSkinIds, mountSkins])

  const isFetching = isAccountMountSkinsFetching || isMountSkinsFetching

  return {
    accountMountSkinIds,
    mountSkins: accountMountSkins,
    isFetching,
    error: accountMountSkinsError,
    hasToken: !!token,
  }
}
