import {
  Card,
  Center,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { useOutfits } from "~/hooks/useOutfits"

export default function Outfits() {
  const { outfits, isFetching, error, hasToken } = useOutfits()

  if (!hasToken) {
    return (
      <Center>Please set up your API token in Settings to view outfits.</Center>
    )
  }

  if (isFetching) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center>
        <Text color="red.500">
          Error loading outfits: {(error as Error).message}
        </Text>
      </Center>
    )
  }

  if (!outfits || outfits.length === 0) {
    return <Center>No outfits found.</Center>
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
      {outfits.map((outfit) => (
        <Card key={outfit.id} direction={"row"} borderRadius={0}>
          <Image
            src={outfit.icon}
            alt={outfit.name}
            boxSize="5rem"
            objectFit="contain"
          />
          <Heading as="h4" size="sm" padding="1rem">
            {outfit.name}
          </Heading>
        </Card>
      ))}
    </SimpleGrid>
  )
}
