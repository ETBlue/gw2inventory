import { useMemo } from "react"
import { useNavigate } from "react-router"
import {
  Center,
  Spinner,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Grid,
} from "@chakra-ui/react"
import { CgArrowDown, CgArrowUp } from "react-icons/cg"
import { useWallet } from "~/hooks/useWallet"
import { useSearchParams } from "~/hooks/url"
import { getQueryString } from "~/helpers/url"
import sharedTableCss from "~/styles/shared-table.module.css"
import { BsQuestionOctagonFill } from "react-icons/bs"
import sharedTextCss from "~/styles/shared-text.module.css"
type WalletSort = "name" | "value"
type WalletOrder = "asc" | "desc"

const WALLET_TABLE_HEADERS: WalletSort[] = ["name", "value"]

export default function Wallet() {
  const { walletWithDetails = [], isFetching, hasToken } = useWallet()
  const navigate = useNavigate()
  const { queryString, sortBy, order } = useSearchParams()

  const activeSortBy: WalletSort = (sortBy as WalletSort) || "name"
  const activeSortOrder: WalletOrder = (order as WalletOrder) || "asc"

  // Sort wallet entries based on selected criteria
  const sortedWalletEntries = useMemo(() => {
    return [...walletWithDetails].sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      switch (activeSortBy) {
        case "name":
          aValue = a.currency?.name ?? `Currency ${a.id}`
          bValue = b.currency?.name ?? `Currency ${b.id}`
          break
        case "value":
          aValue = a.value
          bValue = b.value
          break
        default:
          return 0
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        return activeSortOrder === "asc" ? result : -result
      } else {
        if (aValue < bValue) return activeSortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return activeSortOrder === "asc" ? 1 : -1
        return 0
      }
    })
  }, [walletWithDetails, activeSortBy, activeSortOrder])

  // Handle column sorting
  const handleSort = (column: WalletSort) => {
    let newQueryString: string

    if (activeSortBy === column) {
      // Toggle order if same column
      const newOrder = activeSortOrder === "asc" ? "desc" : "asc"
      newQueryString = getQueryString("order", newOrder, queryString)
    } else {
      // Set new column and reset to asc
      const tempQueryString = getQueryString("sortBy", column, queryString)
      newQueryString = getQueryString("order", "asc", tempQueryString)
    }

    navigate(`/account/wallet?${newQueryString}`)
  }

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <Table className={sharedTableCss.table}>
        <Thead>
          <Tr>
            <Th></Th>
            {WALLET_TABLE_HEADERS.map((header) => (
              <Th
                key={header}
                cursor="pointer"
                onClick={() => handleSort(header)}
                className={`${sharedTableCss.title} ${activeSortBy === header ? sharedTableCss.active : ""}`}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
                {activeSortBy === header && (
                  <>
                    {" "}
                    {activeSortOrder === "asc" ? (
                      <CgArrowDown />
                    ) : (
                      <CgArrowUp />
                    )}
                  </>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sortedWalletEntries.map((entry) => (
            <Tr key={entry.id}>
              <Td className={sharedTableCss.iconCell}>
                {entry.currency?.icon && (
                  <Image
                    src={entry.currency.icon}
                    alt={entry.currency?.name || `Currency ${entry.id}`}
                    className={`${sharedTableCss.icon}`}
                    fallback={<BsQuestionOctagonFill size="3.5rem" />}
                  />
                )}
              </Td>
              <Td className={sharedTableCss.nameCell}>
                <Heading as="h4" size="sm" className={`${sharedTableCss.name}`}>
                  {entry.currency?.name || `Currency ${entry.id}`}
                </Heading>
                {entry.currency?.description && (
                  <p
                    className={`${sharedTableCss.description} ${sharedTextCss.secondary}`}
                  >
                    {entry.currency.description}
                  </p>
                )}
              </Td>
              <Td>{entry.value.toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : sortedWalletEntries.length === 0 ? (
        <Center>No currency found</Center>
      ) : null}
    </Grid>
  )
}
