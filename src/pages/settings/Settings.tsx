import React, { useState, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { FaExternalLinkAlt, FaSave, FaTrashAlt } from "react-icons/fa"
import { Box, Button, Code, Grid, Heading, Input, Link } from "@chakra-ui/react"

import { queryFunction } from "helpers/api"
import TokenContext from "contexts/TokenContext"
import { UsedAccount } from "contexts/types/TokenContext"
import ItemContext from "contexts/ItemContext"

function Settings() {
  const {
    currentAccount,
    usedAccounts,
    addUsedAccount,
    removeUsedAccount,
    setCurrentAccount,
  } = useContext(TokenContext)
  const { setCharacterItems } = useContext(ItemContext)

  const handleDelete = (account: UsedAccount) => {
    removeUsedAccount(account)
    if (currentAccount?.token === account.token) {
      setCurrentAccount(null)
      setCharacterItems([])
    }
  }

  const [token, setToken] = useState("")

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
        name: data.name,
        token,
      }
      addUsedAccount(account)
      setCurrentAccount(account)
      setToken("")
    }
  }

  return (
    <Box margin="0 auto" padding="1rem" maxWidth="60rem">
      <Heading
        size="lg"
        textAlign="center"
        fontFamily="Rosario"
        marginBottom="2rem"
      >
        Manage Tokens in Your Local Storage
      </Heading>
      <Grid templateColumns="auto 1fr auto" gap="1rem" alignItems="center">
        {usedAccounts.map((account: UsedAccount) => {
          return (
            <>
              <Heading
                size="md"
                key={account.name}
                fontWeight="normal"
                fontFamily="Rosario"
              >
                {account.name}
              </Heading>
              <Code fontSize="sm" key={account.token}>
                {account.token}
              </Code>
              <Button
                key={account.token + " button"}
                variant="ghost"
                onClick={() => {
                  handleDelete(account)
                }}
              >
                <FaTrashAlt />
              </Button>
            </>
          )
        })}
        <div>Add new...</div>
        <Input
          autoFocus={true}
          placeholder="paste your token here"
          value={token}
          onChange={(e) => {
            setToken(e.currentTarget.value)
          }}
        />
        <Button variant="ghost" isLoading={isFetching} onClick={handleSubmit}>
          <FaSave />
        </Button>
        <div />
        <Box fontSize="0.875rem" color="gray.600">
          Don't have an API key? Get one for your account from{" "}
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
