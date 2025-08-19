import { GiCheckMark } from "react-icons/gi"
import { Fragment, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Badge,
  Center,
  CheckboxIcon,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Spinner,
} from "@chakra-ui/react"
import { useToken } from "~/hooks/useToken"
import { useTitles } from "~/hooks/useTitles"
import { Account } from "@gw2api/types/data/account"
import { queryFunction } from "~/helpers/api"
import { format } from "date-fns"
import sharedTextCss from "~/styles/shared-text.module.css"
import sharedLayoutCss from "~/styles/shared-layout.module.css"
import { FaCrown } from "react-icons/fa"

function formatAccessText(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
    .replace(/([a-zA-Z])(\d)/g, "$1 $2") // Add space before numbers
    .replace(/(\d)([a-zA-Z])/g, "$1 $2") // Add space after numbers
}

function Overview() {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  const { data: account, isFetching: isAccountFetching } = useQuery<Account>({
    queryKey: ["account", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const { data: progression, isFetching: isProgressionFetching } = useQuery<
    { id: string; value: number }[]
  >({
    queryKey: ["account/progression", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const { titles, isFetching: isTitlesFetching } = useTitles()

  // Sort titles alphabetically by name for consistent display
  const sortedTitles = useMemo(() => {
    if (!titles) return undefined
    return [...titles].sort((a, b) => a.name.localeCompare(b.name))
  }, [titles])

  if (!token) return <Center>No account selected</Center>

  if (isAccountFetching || isProgressionFetching || isTitlesFetching)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  if (!account || !progression) return null

  return (
    <Center flexDirection={"column"} padding="2rem">
      <Heading size="md" key={account.name} fontFamily="Rosario">
        {account.name}
      </Heading>
      <p className={sharedTextCss.secondary}>
        Created at{" "}
        {format(new Date(account.created), "MMMM d, yyyy 'at' h:mm a")}
      </p>
      <Divider border={"none"} margin={"0.5rem 0"} />
      <dl className={sharedLayoutCss.dl}>
        <dt>Access</dt>
        <dd>
          {account.access.map((item) => (
            <Badge
              key={item}
              margin="0 0.5rem 0.25rem 0"
              padding="0"
              textTransform={"none"}
              fontWeight={"normal"}
              fontFamily={"Rosario"}
              fontSize={"0.875rem"}
              display={"inline-flex"}
              alignItems={"center"}
              gap={"0.25rem"}
              background={"none"}
            >
              <GiCheckMark style={{ color: "green" }} />
              {formatAccessText(item)}
            </Badge>
          ))}
        </dd>
        <dt>WvW Rank</dt>
        <dd>{account.wvw_rank}</dd>
        <dt>Fractal Level</dt>
        <dd>{account.fractal_level}</dd>
        {progression.map((item) => (
          <Fragment key={item.id}>
            <dt>{item.id.replace(/_/g, " ")}</dt>
            <dd>{item.value.toLocaleString()}</dd>
          </Fragment>
        ))}
        <dt>Titles</dt>
        <dd>{sortedTitles?.length || 0}</dd>
      </dl>
      <Divider border={"none"} margin={"0.5rem 0"} />
      <List>
        {sortedTitles?.map((title) => (
          <ListItem key={title.id}>
            <ListIcon as={FaCrown} color="gold" />
            {title.name}
            {title.ap_required && (
              <span className={sharedTextCss.secondary}>
                {" "}
                (${title.ap_required} AP)
              </span>
            )}
          </ListItem>
        ))}
      </List>
    </Center>
  )
}

export default Overview
