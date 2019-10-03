import React, {useContext, useState} from 'react'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

const Mastery = () => {
  const {masteries} = useContext(SystemContext)
  const {accountMasteries} = useContext(AccountContext)

  const [selected, setSelected] = useState(1)

  const handleClick = e => {
    const id = e.target.dataset.id
    setSelected(parseInt(id, 10))
  }

  // render

  const mastery = masteries.find(m => m.id === selected)
  const current = accountMasteries.find(m => m.id === selected)

  return (
    <div id='mastery' className='ui two column stackable grid'>
      <div className='four wide column'>
        <div className='ui secondary pointing vertical fluid menu'>
          {masteries.length > 0 && masteries.map(group => (
            <a key={group.id}
              className={`${selected === group.id && 'active'} item`}
              data-id={group.id}
              onClick={handleClick} >
              {group.name}
            </a>
          ))}
        </div>
      </div>
      <div className='twelve wide column'>
        {mastery && (
          <h3 className='ui pink dividing header'>
            {mastery.name}
            <span className='small'>
              (Region: {mastery.region})
            </span>
            <div className='sub header'>
              {mastery.requirement}
            </div>
          </h3>
        )}
        {mastery && accountMasteries && (
          <div className='ui relaxed divided items'>
            {mastery.levels && mastery.levels.map((level, index) => (
              <div key={level.name} className='item'>
                <div className={`ui tiny rounded ${current && index <= current.level && 'done'} image`}>
                  {current && index <= current.level && (
                    <span className='ui left corner mini green label'>
                      <i className='icon check' />
                    </span>
                  )}
                  <img src={level.icon} />
                </div>
                <div className='content'>
                  <div className='header'>
                    {level.name}
                  </div>
                  <div className='meta'>
                    {level.description}
                  </div>
                  <div className='ui list'>
                    <div className='item'>
                      {current && index <= current.level ? null : (
                        <i className='icon grey lock' />
                      )}
                      <div className='content'>
                        {level.instruction}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Mastery
