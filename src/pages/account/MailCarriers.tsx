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

import { useMailCarriers } from "~/hooks/useMailCarriersData"

export default function MailCarriers() {
  const { mailCarriers = [], isFetching, error, hasToken } = useMailCarriers()

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {mailCarriers.map((carrier) => (
          <Card key={carrier.id} direction={"row"} borderRadius={0}>
            <Image
              src={carrier.icon}
              alt={carrier.name}
              boxSize="5rem"
              objectFit="contain"
            />
            <Heading as="h4" size="sm" padding="1rem">
              {carrier.name}
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
      ) : mailCarriers.length === 0 ? (
        <Center>No skin found</Center>
      ) : error ? (
        <Center>
          <Text color="red.500">
            Error loading mail carriers: {(error as Error).message}
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
