import React, {useContext} from 'react'

import {AccountContext} from '../../_context/AccountContext'
import {SystemContext} from '../../_context/SystemContext'

import getList from './getList'

const Glider = () => {
  const {gliders} = useContext(SystemContext)
  const {accountGliders} = useContext(AccountContext)

  const {sorted, locked} = getList({
    array: accountGliders,
    dictionary: gliders
  })

  return (
    <div id='Glider' className='ui two column stackable grid'>
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
                <img src={gliders[id].icon} />
              </div>
              <div className='content'>
                {gliders[id].name}
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
                <img src={gliders[id].icon} />
              </div>
              <div className='content'>
                <i className='icon grey lock' />
                {gliders[id].name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Glider
