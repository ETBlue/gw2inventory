import { useCallback, useState } from "react"

import { Box, Button, Flex, Grid, Heading, Input, Link } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"

import {
  FaCopy,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaTrashAlt,
} from "react-icons/fa"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { UsedAccount } from "~/types/tokens"

function Settings() {
  const {
    currentAccount,
    usedAccounts,
    addUsedAccount,
    removeUsedAccount,
    setCurrentAccount,
  } = useToken()

  const handleDelete = (account: UsedAccount) => {
    removeUsedAccount(account)
    // ItemContext will automatically reset when currentAccount changes
    if (currentAccount?.token === account.token) {
      setCurrentAccount(null)
    }
  }

  const [revealedTokens, setRevealedTokens] = useState<Set<string>>(new Set())
  const [showNewToken, setShowNewToken] = useState(false)
  const [token, setToken] = useState("")

  const toggleReveal = useCallback((tokenValue: string) => {
    setRevealedTokens((prev) => {
      const next = new Set(prev)
      if (next.has(tokenValue)) {
        next.delete(tokenValue)
      } else {
        next.add(tokenValue)
      }
      return next
    })
  }, [])

  const copyToken = useCallback((tokenValue: string) => {
    navigator.clipboard.writeText(tokenValue)
  }, [])

  const { refetch, isFetching } = useQuery({
    queryKey: ["account", token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: false,
  })

  const handleSubmit = async () => {
    const { data } = await refetch()
    if (data) {
      const account = {
        name: (data as any).name,
        token,
      }
      addUsedAccount(account)
      setCurrentAccount(account)
      setToken("")
    }
  }

  return (
    <Box margin="0 auto" padding="1rem" maxWidth="64rem">
      <Heading size="lg" textAlign="center" marginBottom="2rem">
        Manage Tokens in Your Local Storage
      </Heading>
      <Grid templateColumns="auto 1fr auto" gap="1rem" alignItems="center">
        {usedAccounts.map((account: UsedAccount) => {
          const isRevealed = revealedTokens.has(account.token)
          return (
            <>
              <Heading
                key={account.name}
                size="md"
                fontWeight="normal"
                fontFamily="Rosario"
              >
                {account.name}
              </Heading>
              <Input
                key={`${account.token}-input`}
                type={isRevealed ? "text" : "password"}
                value={account.token}
                fontFamily="monospace"
                fontSize="sm"
                backgroundColor="gray.100"
                readOnly
              />
              <Flex key={`${account.token}-buttons`}>
                <Button
                  variant="ghost"
                  aria-label={isRevealed ? "Hide token" : "Reveal token"}
                  onClick={() => toggleReveal(account.token)}
                >
                  {isRevealed ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Button
                  variant="ghost"
                  aria-label="Copy token"
                  onClick={() => copyToken(account.token)}
                >
                  <FaCopy />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleDelete(account)
                  }}
                >
                  <FaTrashAlt />
                </Button>
              </Flex>
            </>
          )
        })}
        <div />
        <div>Add new...</div>
        <Input
          autoFocus={true}
          type={showNewToken ? "text" : "password"}
          placeholder="paste your token here"
          value={token}
          onChange={(e) => {
            setToken(e.currentTarget.value)
          }}
          fontFamily="monospace"
          fontSize="sm"
        />
        <Flex>
          <Button
            variant="ghost"
            aria-label={showNewToken ? "Hide token" : "Show token"}
            onClick={() => setShowNewToken((prev) => !prev)}
          >
            {showNewToken ? <FaEyeSlash /> : <FaEye />}
          </Button>
          <Button variant="ghost" isLoading={isFetching} onClick={handleSubmit}>
            <FaSave />
          </Button>
        </Flex>
        <div />
        <Box fontSize="0.875rem" color="gray.600" gridColumn="span 4">
          Don&apos;t have an API key? Get one for your account from{" "}
          <Link
            href="https://account.arena.net/applications"
            isExternal
            color="pink.500"
          >
            Arena.net API Key Management{" "}
            <FaExternalLinkAlt
              style={{ display: "inline", verticalAlign: "text-top" }}
            />
          </Link>
        </Box>
      </Grid>
    </Box>
  )
}

export default Settings
