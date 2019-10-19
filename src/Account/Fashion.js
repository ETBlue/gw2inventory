import React, {useContext, useState} from 'react'
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
    if (!dictionary[a] || !dictionary[b]) {
      return 0
    }
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
  const unlocked = sortByName({array, dictionary})
  const all = sortByName({array: Object.keys(dictionary).map(key => dictionary[key].id), dictionary})
  const locked = []
  for (const id of all) {
    if (!unlocked.includes(id)) {
      locked.push(id)
    }
  }
  return {unlocked, locked}
}

const Mount = ({accountMountTypes, accountMountSkins, mountTypes}) => mountTypes.map(type => (
  <React.Fragment>
    <h2 className='ui pink inverted block header'>
      {accountMountTypes.includes(type.id) ? (
        <i className='icon green check' />
      ) : (
        <i className='icon grey lock' />
      )}
      <span className='content'>
        {type.name}
      </span>
    </h2>
    <Content
      array={type.skins.filter(id => accountMountSkins.includes(id))}
      dictionary={type.dictionary} />
  </React.Fragment>
))

const Novelty = ({accountNovelties, novelties}) => novelties.map(type => (
  <React.Fragment>
    <h2 className='ui pink inverted block header'>
      {type.id}
    </h2>
    <Content
      array={type.items.filter(id => accountNovelties.includes(id))}
      dictionary={type.dictionary} />
  </React.Fragment>
))

const ITEM_PER_PAGE = 25

const Content = ({array, dictionary}) => {
  const {unlocked, locked} = getList({
    array,
    dictionary
  })

  const [displayed, setDisplayed] = useState(ITEM_PER_PAGE)

  const handleClick = () => {
    setDisplayed(prev => prev + ITEM_PER_PAGE)
  }

  const isSplitted = unlocked.length > displayed || locked.length > displayed

  return (
    <React.Fragment>
      <div className='ui two column stackable grid'>
        <div className='column'>
          <h3 className='ui pink dividing header'>
            Unlocked
          </h3>
          <div className='unlocked list'>
            {unlocked.slice(0, displayed).map(id => dictionary[id] && (
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
            {locked.slice(0, displayed).map(id => dictionary[id] && (
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
      {isSplitted && (
        <div className='ui horizontal pink divider'>
          <div
            onClick={handleClick}
            className='ui center aligned basic button'>
            <i className='icon down chevron' />
            Show more than {displayed} items...
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

const Fashion = ({location}) => {
  const {token, account} = useContext(AccountContext)

  const {
    outfits,
    gliders,
    mountTypes,
    minis,
    mailcarriers,
    novelties
  } = useContext(SystemContext)

  const {
    accountOutfits,
    accountGliders,
    accountMountTypes,
    accountMountSkins,
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
    mount: {
      accountMountTypes,
      accountMountSkins,
      mountTypes
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
      accountNovelties,
      novelties
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
              <Route path={`${higherLevelPath}/mount`} render={() => <Mount {...props.mount} />} />
              <Route path={`${higherLevelPath}/novelty`} render={() => <Novelty {...props.novelty} />} />
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
