import { useMemo } from "react"

import {
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Tag,
  Text,
} from "@chakra-ui/react"

import { Link, useSearchParams } from "react-router"

import { getQueryString } from "~/helpers/url"
import { useMountSkins } from "~/hooks/useMountSkinsData"

const formatMountType = (type: string): string =>
  type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export default function Mounts() {
  const { mountSkins = [], isFetching, error, hasToken } = useMountSkins()
  const [searchParams] = useSearchParams()
  const typeFilter = searchParams.get("type")

  const mountTypes = useMemo(() => {
    const types = new Set(mountSkins.map((skin) => skin.mount))
    return [...types].sort((a, b) => a.localeCompare(b))
  }, [mountSkins])

  const filteredSkins = useMemo(() => {
    if (!typeFilter) return mountSkins
    return mountSkins.filter((skin) => skin.mount === typeFilter)
  }, [mountSkins, typeFilter])

  const getCountForType = (type: string): number =>
    mountSkins.filter((skin) => skin.mount === type).length

  return (
    <Grid gridTemplateRows={"auto auto 1fr"}>
      {mountSkins.length > 0 && (
        <Flex
          flexWrap="wrap"
          justifyContent="center"
          margin="0 auto"
          borderBottom={"1px solid var(--chakra-border-color)"}
        >
          <Button
            as={Link}
            variant="ghost"
            fontWeight="normal"
            borderRadius={0}
            isActive={!typeFilter}
            to={"/account/mounts"}
          >
            All
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {mountSkins.length}
            </Tag>
          </Button>
          {mountTypes.map((type) => (
            <Button
              key={type}
              as={Link}
              variant="ghost"
              fontWeight="normal"
              borderRadius={0}
              isActive={type === typeFilter}
              to={`/account/mounts?${getQueryString("type", type, searchParams.toString())}`}
            >
              {formatMountType(type)}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {getCountForType(type)}
              </Tag>
            </Button>
          ))}
        </Flex>
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {filteredSkins.map((skin) => (
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
      ) : filteredSkins.length === 0 ? (
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
