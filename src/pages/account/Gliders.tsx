import {
  Card,
  Center,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react"

import { useGliders } from "~/hooks/useGlidersData"

export default function Gliders() {
  const { gliders = [], isFetching, error, hasToken } = useGliders()

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {gliders.map((glider) => (
          <Card key={glider.id} direction={"row"} borderRadius={0}>
            <Image
              src={glider.icon}
              alt={glider.name}
              boxSize="5rem"
              objectFit="contain"
            />
            <Heading as="h4" size="sm" padding="1rem">
              {glider.name}
            </Heading>
          </Card>
        ))}
      </SimpleGrid>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : gliders.length === 0 ? (
        <Center>No skin found</Center>
      ) : error ? (
        <Center>
          <Text color="red.500">
            Error loading gliders: {(error as Error).message}
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
