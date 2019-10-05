import React, {useContext, useState} from 'react'
import {NavLink, Route, Switch, withRouter, Redirect} from 'react-router-dom'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

import trimPath from '../_func/trimPath'

import Overview from './Overview'
import Achievement from './Achievement'
import Mastery from './Mastery'
import Fashion from './Fashion'

import './Account.scss'

const MENU = [
  {
    id: 'overview',
    name: 'Overview',
    component: Overview
  }, {
    id: 'achievement',
    name: 'Achievements',
    component: Achievement
  }, {
    id: 'mastery',
    name: 'Masteries',
    component: Mastery
  }, {
    id: 'fashion',
    name: 'Fashion',
    component: Fashion
  }
]

// const getTimeStamp = () => {
//   const now = new moment()
//   return now.format(DATE_FORMAT)
// }

const Account = ({location}) => {
  const {worlds} = useContext(SystemContext)
  const {token, account, fetchAccountInfo} = useContext(AccountContext)

  // let user refresh data manually

  const [buttonState, setButtonState] = useState('')
  // const [timestamp, setTimestamp] = useState('')
  const handleRefresh = async () => {
    setButtonState('loading')
    await fetchAccountInfo()
    // setTimestamp(getTimeStamp())
    setButtonState('')
  }

  // render

  const higherLevelPath = trimPath({path: location.pathname, level: 1})

  return (
    <div id='Account'>
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
          {MENU.map(item => (
            <NavLink key={item.id} className='item'
              to={`${higherLevelPath}/${item.id}?source=${token}`}
              isActive={(match, location) => location.pathname.includes(`${higherLevelPath}/${item.id}`)} >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </header>
      <article name='content'>
        <div className='ui container'>
          {account && (
            <Switch>
              {MENU.map(item => (
                <Route key={item.id} path={`${higherLevelPath}/${item.id}`} component={item.component} />
              ))}
              <Route render={() => <Redirect to={`${higherLevelPath}/${MENU[0].id}?source=${token}`} />} />
            </Switch>
          )}
        </div>
      </article>
    </div>
  )
}

export default withRouter(Account)
