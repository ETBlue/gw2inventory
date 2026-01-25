import { useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"

export default function useHomesteadGlyphs() {
  const { currentAccount } = useToken()
  const { homesteadGlyphs, isHomesteadGlyphsFetching } = useStaticData()

  const {
    data: accountGlyphIds,
    isLoading: isAccountGlyphsLoading,
    error: accountGlyphsError,
  } = useQuery<string[]>({
    queryKey: ["account/homestead/glyphs", currentAccount?.token],
    queryFn: queryFunction as any,
    enabled: !!currentAccount?.token,
  })

  const hasToken = !!currentAccount?.token
  const isFetching = isHomesteadGlyphsFetching || isAccountGlyphsLoading

  return {
    hasToken,
    homesteadGlyphs,
    accountGlyphIds,
    isFetching,
    error: accountGlyphsError,
  }
}
