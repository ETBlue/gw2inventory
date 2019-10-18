import React, {useContext} from 'react'
import {NavLink, Route, Switch, Redirect} from 'react-router-dom'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

import trimPath from '../_func/trimPath'

const MENU = [
  {
    id: 'outfit',
    name: 'Outfits'
  }, {
    id: 'glider',
    name: 'Gliders'
  }, {
    id: 'mount',
    name: 'Mounts'
  }, {
    id: 'mini',
    name: 'Minis'
  }, {
    id: 'mailcarrier',
    name: 'Mail carriers'
  }, {
    id: 'finisher',
    name: 'Finishers'
  }, {
    id: 'novelty',
    name: 'Novelties'
  }
]

const sortByName = ({array, dictionary}) => {
  return array.sort((a, b) => {
    if (dictionary[a].name > dictionary[b].name) {
      return 1
    } else if (dictionary[a].name < dictionary[b].name) {
      return -1
    } else {
      return 0
    }
  })
}

const getList = ({array, dictionary}) => {
  const sorted = sortByName({array, dictionary})
  const all = sortByName({array: Object.keys(dictionary).map(key => dictionary[key].id), dictionary})
  const locked = []
  for (const id of all) {
    if (!sorted.includes(id)) {
      locked.push(id)
    }
  }
  return {sorted, locked}
}

const Content = ({array, dictionary}) => {
  const {sorted, locked} = getList({
    array,
    dictionary
  })

  return (
    <div className='ui two column stackable grid'>
      <div className='column'>
        <h3 className='ui pink dividing header'>
          Unlocked
        </h3>
        <div className='unlocked list'>
          {sorted.map(id => (
            <div key={id} className='item'>
              <div className='ui tiny rounded image'>
                <span className='ui left corner mini green label'>
                  <i className='icon check' />
                </span>
                <img src={dictionary[id].icon} />
              </div>
              <div className='content'>
                {dictionary[id].name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='column'>
        <h3 className='ui pink dividing header'>
          Locked
        </h3>
        <div className='locked list'>
          {locked.map(id => (
            <div key={id} className='item'>
              <div className='ui tiny rounded image'>
                <img src={dictionary[id].icon} />
              </div>
              <div className='content'>
                <i className='icon grey lock' />
                {dictionary[id].name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Fashion = ({location}) => {
  const {token, account} = useContext(AccountContext)

  const {
    outfits,
    gliders,
    minis,
    mailcarriers,
    novelties
  } = useContext(SystemContext)

  const {
    accountOutfits,
    accountGliders,
    accountMinis,
    accountMailcarriers,
    accountNovelties
  } = useContext(AccountContext)

  // render

  const props = {
    outfit: {
      array: accountOutfits,
      dictionary: outfits
    },
    glider: {
      array: accountGliders,
      dictionary: gliders
    },
    mini: {
      array: accountMinis,
      dictionary: minis
    },
    mailcarrier: {
      array: accountMailcarriers,
      dictionary: mailcarriers
    },
    novelty: {
      array: accountNovelties,
      dictionary: novelties
    }
  }

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
                <Route key={item.id} path={`${higherLevelPath}/${item.id}`} render={() => <Content {...props[item.id]} />} />
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
