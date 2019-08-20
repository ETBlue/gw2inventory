import React, {useContext, useState, useEffect, useCallback} from 'react'
import {Link, NavLink, Route, Switch, withRouter, Redirect} from 'react-router-dom'
import queryString from 'query-string'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

const ACCOUNT_MENU = [
  {
    id: 'info',
    name: 'Info'
  }, {
    id: 'home',
    name: 'Home'
  }, {
    id: 'mastery',
    name: 'Masteries'
  }, {
    id: 'fashion',
    name: 'Fashion'
  }
]

const Info = () => {
  const {account, guilds} = useContext(AccountContext)
  if (!account) {
    return null
  }
  const guildList = account.guilds.map(id => (
    <div key={id} className='item'>
      <span className='ui pink horizontal label'>
        {guilds[id] && guilds[id].tag}
      </span>
      {guilds[id] && guilds[id].name}
    </div>
  ))
  return (
    <div className='ui two colume stackable grid'>
      <div className='eight wide column'>
        lalala
      </div>
      <div className='eight wide column'>
        <div className='ui list'>
          {guildList}
        </div>
      </div>
    </div>
  )
}

const ACCOUNT_ROUTES = [
  {
    path: 'info',
    component: Info
  }
]

const trimPath = ({level, path}) => {
  const segments = path.split('/').filter(item => item.length !== 0)
  return `${segments.slice(0, level).join('/')}`
}

const Account = ({location}) => {
  const {items, worlds} = useContext(SystemContext)
  const {token, account, guilds, getAccountInfo} = useContext(AccountContext)

  const [buttonState, setButtonState] = useState('')
  const handleRefresh = useCallback(async () => {
    setButtonState('loading')
    await getAccountInfo()
    setButtonState('')
  }, [getAccountInfo])

  return (
    <div className='Account'>
      <header name='header'>
        <div name='refresh'>
          <span onClick={handleRefresh}
            className={`ui borderless basic icon ${buttonState} button`} >
            <i className='icon refresh' />
          </span>
        </div>
        <h1 className='ui pink icon header'>
          {account && `${account.name} from ${worlds[account.world] && worlds[account.world].name}`}
        </h1>
        <hr className='ui hidden fitted divider' />
        <nav className='ui secondary compact menu'>
          {ACCOUNT_MENU.map(item => (
            <NavLink key={item.id} className='item'
              to={`/${trimPath({path: location.pathname, level: 1})}/${item.id}?source=${token}`}
              isActive={(match, location) => location.pathname.includes(`/${trimPath({path: location.pathname, level: 1})}/${item.id}`)} >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </header>
      <div className='ui container'>
        <div name='divider' />
      </div>
      <article name='content'>
        <div className='ui container'>
          {account && (
            <Switch>
              {ACCOUNT_ROUTES.map(item => (
                <Route key={item.path} path={`/${trimPath({path: location.pathname, level: 1})}/${item.path}`} component={item.component} />
              ))}
              <Route render={() => <Redirect to={`/${trimPath({path: location.pathname, level: 1})}/${ACCOUNT_ROUTES[0].path}?source=${token}`} />} />
            </Switch>
          )}
        </div>
      </article>
    </div>
  )
}

export default withRouter(Account)
