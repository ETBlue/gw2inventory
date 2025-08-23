import { Box, Grid } from "@chakra-ui/react"

import Header from "~/layouts/Header"

interface Props {
  children?: React.ReactNode
}

function BaseFrame(props: Props) {
  const { children } = props

  return (
    <Grid templateRows="auto 3.5rem 1fr" height="100vh">
      <div />
      <Header />
      <Box background="hsla(50, 30%, 98%, 1)" padding="1rem">
        {children}
      </Box>
    </Grid>
  )
}

export default BaseFrame
