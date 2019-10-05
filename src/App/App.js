import React, {useContext, useEffect} from 'react'
import {Link, NavLink, Route, Switch, withRouter} from 'react-router-dom'
import queryString from 'query-string'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

import {Account} from '../Account'
import './App.scss'

const MENU = [
  {
    id: 'account',
    name: 'Account',
    component: Account
  }, {
    id: 'character',
    name: 'Characters'
  }, {
    id: 'inventory',
    name: 'Inventory'
  }, {
    id: 'trade',
    name: 'Trades'
  }
]

const App = ({location}) => {
  // retrieve access token from url

  const {history, account, token, setToken} = useContext(AccountContext)

  // update token on url params change

  useEffect(() => {
    const query = queryString.parse(location.search)
    if (query.source && query.source !== token) {
      setToken(query.source)
    }
  }, [location.search])

  // update token on input submit


  // ...

  return (
    <div className='App'>
      <nav className='Header ui borderless inverted menu'>
        <Link to={`/?source=${token}`} className='item'>
          <span className='logo'>
            <img src='favicon.png' />
          </span>
        </Link>
        {MENU.map(item => (
          <NavLink key={item.id} className='item'
            to={`/${item.id}?source=${token}`}
            isActive={(match, location) => location.pathname.includes(`/${item.id}`)} >
            {item.name}
          </NavLink>
        ))}
        <div className='ui right simple dropdown item'>
          {account && account.name}
          <i className='dropdown icon' />
          <div className='inverted menu'>
            {history.map(item => (
              <Link key={item.token} to={`/?source=${item.token}`} className='item'>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <Switch>
        {MENU.map(item => (
          <Route key={item.id} path={`/${item.id}`} component={item.component} />
        ))}
        <Route path='/' component={Home} />
      </Switch>
      <footer>
      </footer>
    </div>
  )
}

export default withRouter(App)
