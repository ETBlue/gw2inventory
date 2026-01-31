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

import { useMountSkins } from "~/hooks/useMountSkinsData"

export default function Mounts() {
  const { mountSkins = [], isFetching, error, hasToken } = useMountSkins()

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {mountSkins.map((skin) => (
          <Card key={skin.id} direction={"row"} borderRadius={0}>
            <Image
              src={skin.icon}
              alt={skin.name}
              boxSize="5rem"
              objectFit="contain"
            />
            <Heading as="h4" size="sm" padding="1rem">
              {skin.name}
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
      ) : mountSkins.length === 0 ? (
        <Center>No skin found</Center>
      ) : error ? (
        <Center>
          <Text color="red.500">
            Error loading mount skins: {(error as Error).message}
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
