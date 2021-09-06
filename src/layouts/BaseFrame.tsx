import React from "react"

import Header from "blocks/Header"

import { Box, Grid } from "@chakra-ui/react"

interface Props {
  children?: React.ReactNode
}

function BaseFrame(props: Props) {
  const { children } = props

  return (
    <Grid templateRows="auto 3.5rem 1fr" height="100vh" width="100vw">
      <div />
      <Header />
      <Box background="hsla(50, 30%, 98%, 1)" padding="2rem">
        {children}
      </Box>
    </Grid>
  )
}

export default BaseFrame
