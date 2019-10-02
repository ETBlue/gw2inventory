import React, {useContext, useState, useEffect, useCallback} from 'react'
import {Link, NavLink, Route, Switch, withRouter, Redirect} from 'react-router-dom'
import queryString from 'query-string'
import moment from 'moment'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

import {DATE_FORMAT} from '../SETTINGS'

import Overview from './Overview'
import './Account.scss'

const ACCOUNT_MENU = [
  {
    id: 'overview',
    name: 'Overview'
  }, {
    id: 'achievement',
    name: 'Achievements'
  }, {
    id: 'mastery',
    name: 'Masteries'
  }, {
    id: 'fashion',
    name: 'Fashion'
  }
]

const Achievement = () => {
  return (
    <p>lalala</p>
  )
}

const Mastery = () => {
  return (
    <p>lalala</p>
  )
}

const Fashion = () => {
  return (
    <p>lalala</p>
  )
}

const ACCOUNT_ROUTES = [
  {
    path: 'overview',
    component: Overview
  }, {
    path: 'achievement',
    component: Achievement
  }, {
    path: 'mastery',
    component: Mastery
  }, {
    path: 'fashion',
    component: Fashion
  }
]

const trimPath = ({level, path}) => {
  const segments = path.split('/').filter(item => item.length !== 0)
  return `${segments.slice(0, level).join('/')}`
}

// const getTimeStamp = () => {
//   const now = new moment()
//   return now.format(DATE_FORMAT)
// }

const Account = ({location}) => {
  const {worlds} = useContext(SystemContext)
  const {token, account, fetchAccountInfo} = useContext(AccountContext)
  const [buttonState, setButtonState] = useState('')
  // const [timestamp, setTimestamp] = useState('')
  const handleRefresh = useCallback(async () => {
    setButtonState('loading')
    await fetchAccountInfo()
    // setTimestamp(getTimeStamp())
    setButtonState('')
  }, [fetchAccountInfo])

  return (
    <div className='Account'>
      <header name='header'>
        <div name='refresh'>
          <span onClick={handleRefresh}
            className={`ui borderless basic icon ${buttonState} button`} >
            <i className='icon refresh' />
          </span>
        </div>
        <h1 className='ui pink header'>
          {account && account.commander ? (
            <span className='ui small image'>
              <img src='../assets/Commander_tag_(purple).png' />
            </span>
          ) : null}
          <div className='content'>
            {account ? account.name : 'loading...'} in {account && worlds[account.world] ? worlds[account.world].name : 'loading...'}
          </div>
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
