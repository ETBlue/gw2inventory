import { useMemo } from "react"
import {
  Center,
  Spinner,
  VStack,
  HStack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react"
import { useWallet } from "~/hooks/useWallet"

export default function Wallet() {
  const { walletWithDetails, isFetching, hasToken } = useWallet()

  // Sort wallet entries by currency order (as defined in game) for consistent display
  const sortedWalletEntries = useMemo(() => {
    if (!walletWithDetails) return undefined
    return [...walletWithDetails].sort((a, b) => {
      const orderA = a.currency?.order ?? 999999
      const orderB = b.currency?.order ?? 999999
      return orderA - orderB
    })
  }, [walletWithDetails])

  if (!hasToken) return <Center>No account selected</Center>

  if (isFetching)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  if (!sortedWalletEntries || sortedWalletEntries.length === 0) {
    return <Center>No wallet data available</Center>
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="xl" fontWeight="bold">
        Wallet ({sortedWalletEntries.length} currencies)
      </Text>
      <VStack spacing={3} align="stretch">
        {sortedWalletEntries.map((entry) => (
          <HStack
            key={entry.id}
            p={3}
            borderWidth={1}
            borderRadius="md"
            justify="space-between"
            align="center"
          >
            <HStack spacing={3}>
              {entry.currency?.icon && (
                <Image
                  src={entry.currency.icon}
                  alt={entry.currency.name}
                  boxSize="24px"
                  fallback={<Box boxSize="24px" bg="gray.200" />}
                />
              )}
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">
                  {entry.currency?.name || `Currency ${entry.id}`}
                </Text>
                {entry.currency?.description && (
                  <Text fontSize="sm" color="gray.600">
                    {entry.currency.description}
                  </Text>
                )}
              </VStack>
            </HStack>
            <Text fontWeight="bold" fontSize="lg">
              {entry.value.toLocaleString()}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  )
}
