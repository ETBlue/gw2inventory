import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useHomesteadGlyphsQuery } from "~/hooks/useStaticData"

export default function useHomesteadGlyphs() {
  const { currentAccount } = useToken()
  const { data: homesteadGlyphs = [], isLoading: isHomesteadGlyphsFetching } =
    useHomesteadGlyphsQuery()

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
