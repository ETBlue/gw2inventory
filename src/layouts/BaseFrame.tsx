import React, { useContext } from "react"
import { Link } from "react-router-dom"

import { APP_NAME, BASE_URL } from "config"
import TokenContext from "contexts/TokenContext"
import Header from "blocks/Header"

import css from "./styles/BaseFrame.module.css"

interface Props {
  children?: React.ReactNode
}

const BaseFrame = (props: Props) => {
  const { children } = props
  const { currentToken } = useContext(TokenContext)

  return (
    <div className={css.base}>
      <Header />
      <div className={css.main}>{children}</div>
    </div>
  )
}

export default BaseFrame
