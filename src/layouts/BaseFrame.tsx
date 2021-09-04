import React, { useContext } from "react"
import { Link } from "react-router-dom"

import { APP_NAME, BASE_URL } from "config"
import TokenContext from "contexts/TokenContext"

import css from "./styles/BaseFrame.module.css"

interface Props {
  children?: React.ReactNode
}

const BaseFrame = (props: Props) => {
  const { children } = props
  const { currentToken } = useContext(TokenContext)

  return (
    <div className={css.base}>
      <div className={css.head}>
        <Link className={css.home} to="/">
          <img
            className={css.logo}
            alt="logo"
            src={`${BASE_URL}/favicon.png`}
          />
          {APP_NAME}
        </Link>
        <div></div>
        <div className={css.action}>
          {currentToken ? currentToken?.account : "Submit your token"}
        </div>
      </div>
      <div className={css.main}>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default BaseFrame
