import React, {useContext} from 'react'
import {NavLink, Route, Switch, Redirect} from 'react-router-dom'

import {AccountContext} from '../_context/AccountContext'

import trimPath from '../_func/trimPath'

import Outfit from './Fashion/Outfit'
import Glider from './Fashion/Glider'

const Mount = () => <p>...</p>
const Mini = () => <p>...</p>
const MailCarrier = () => <p>...</p>
const Finisher = () => <p>...</p>
const Novelty = () => <p>...</p>

const MENU = [
  {
    id: 'outfit',
    name: 'Outfits',
    component: Outfit
  }, {
    id: 'glider',
    name: 'Gliders',
    component: Glider
  }, {
    id: 'mount',
    name: 'Mounts',
    component: Mount
  }, {
    id: 'mini',
    name: 'Minis',
    component: Mini
  }, {
    id: 'mail_carrier',
    name: 'Mail carriers',
    component: MailCarrier
  }, {
    id: 'finisher',
    name: 'Finishers',
    component: Finisher
  }, {
    id: 'novelty',
    name: 'Novelties',
    component: Novelty
  }
]

const Fashion = ({location}) => {
  const {token, account} = useContext(AccountContext)

  // render

  const higherLevelPath = trimPath({path: location.pathname, level: 2})

  return (
    <div id='Fashion'>
      <div className='ui two column stackable grid'>
        <div className='four wide column'>
          <div className='ui secondary pointing vertical fluid menu'>
            {MENU.map(item => (
              <NavLink key={item.id} className='item'
                to={`${higherLevelPath}/${item.id}?source=${token}`}
                isActive={(match, location) => location.pathname.includes(`${higherLevelPath}/${item.id}`)} >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
        <div className='twelve wide column'>
          {account && (
            <Switch>
              {MENU.map(item => (
                <Route key={item.id} path={`${higherLevelPath}/${item.id}`} component={item.component} />
              ))}
              <Route render={() => <Redirect to={`${higherLevelPath}/${MENU[0].id}?source=${token}`} />} />
            </Switch>
          )}
        </div>
      </div>
    </div>
  )
}

export default Fashion
