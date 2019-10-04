import React, {useContext, useState} from 'react'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

const MENU = [
  'outfits',
  'gliders',
  'mounts',
  'minis',
  'mail carriers',
  'finishers',
  'novelties'
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

const Outfit = ({array, dictionary}) => {
  const sorted = sortByName({array, dictionary})
  const all = sortByName({array: Object.keys(dictionary).map(key => dictionary[key].id), dictionary})
  const locked = []
  for (const id of all) {
    if (!sorted.includes(id)) {
      locked.push(id)
    }
  }

  return (
    <div className='ui two column stackable grid'>
      <div className='column'>
        <h3 className='ui pink dividing header'>
          Unlocked
        </h3>
        <div className='ui middle aligned list'>
          {sorted.map(id => (
            <div key={id} className='item'>
              <img className='ui mini bordered rounded image' src={dictionary[id].icon} />
              <div className='content'>
                <div className='header'>
                  {dictionary[id].name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='column'>
        <h3 className='ui pink dividing header'>
          Locked
        </h3>
        <div className='ui middle aligned locked list'>
          {locked.map(id => (
            <div key={id} className='item'>
              <img className='ui mini bordered rounded image' src={dictionary[id].icon} />
              <div className='content'>
                <div className='header'>
                  <i className='icon grey lock' />
                  {dictionary[id].name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Fashion = () => {
  const {outfits} = useContext(SystemContext)
  const {accountOutfits} = useContext(AccountContext)

  const [selected, setSelected] = useState('outfits')
  const handleClick = e => {
    const id = e.currentTarget.dataset.id
    setSelected(id)
  }

  // render

  const listProps = {
    array: accountOutfits,
    dictionary: outfits
  }

  return (
    <div id='Fashion'>
      <div className='ui two column stackable grid'>
        <div className='four wide column'>
          <div className='ui secondary pointing vertical fluid menu'>
            {MENU.map(id => (
              <a key={id}
                className={`${selected === id && 'active'} item`}
                data-id={id}
                onClick={handleClick} >
                {id}
              </a>
            ))}
          </div>
        </div>
        <div className='twelve wide column'>
          <Outfit {...listProps} />
        </div>
      </div>
    </div>
  )
}

export default Fashion
