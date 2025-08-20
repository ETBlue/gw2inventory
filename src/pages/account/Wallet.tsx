import { useState, useMemo } from "react"
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
import sharedTableCss from "~/styles/shared-table.module.css"
import { BsQuestionOctagonFill } from "react-icons/bs"
import sharedTextCss from "~/styles/shared-text.module.css"
type WalletSort = "name" | "value"
type WalletOrder = "asc" | "desc"

const WALLET_TABLE_HEADERS: WalletSort[] = ["name", "value"]

export default function Wallet() {
  const { walletWithDetails = [], isFetching, hasToken } = useWallet()
  const [sortBy, setSortBy] = useState<WalletSort>("name")
  const [sortOrder, setSortOrder] = useState<WalletOrder>("asc")

  // Sort wallet entries based on selected criteria
  const sortedWalletEntries = useMemo(() => {
    return [...walletWithDetails].sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      switch (sortBy) {
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
        return sortOrder === "asc" ? result : -result
      } else {
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
        return 0
      }
    })
  }, [walletWithDetails, sortBy, sortOrder])

  // Handle column sorting
  const handleSort = (column: WalletSort) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
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
                className={`${sharedTableCss.title} ${sortBy === header ? sharedTableCss.active : ""}`}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
                {sortBy === header && (
                  <> {sortOrder === "asc" ? <CgArrowDown /> : <CgArrowUp />}</>
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
