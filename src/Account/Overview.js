import React, {useContext} from 'react'
import moment from 'moment'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

import {DATE_FORMAT} from '../SETTINGS'

const ACCESS_TEXT = {
  PlayForFree: 'Free trial',
  GuildWars2: 'Guild Wars 2',
  HeartOfThorns: 'Heart of Thorns',
  PathOfFire: 'Path of Fire'
}

const LEVEL_TYPE = [
  'fractal_level',
  'wvw_rank'
]

const LEVEL_TEXT = {
  fractal_level: 'Fractal',
  wvw_rank: 'WvW'
}

const Overview = () => {
  const {account, accountHomeNodes, guilds, magicFind} = useContext(AccountContext)
  const {files} = useContext(SystemContext)

  if (!account) {
    return null
  }

  return (
    <div id='overview' className='ui two column stackable grid'>
      <div className='eight wide column'>
        <h3 className='ui pink dividing header'>
          Birth
        </h3>
        <div className='ui list'>
          <div className='item'>
            Created at: {moment(account.created).format(DATE_FORMAT)}
          </div>
          <div className='item'>
            Account age: {moment.duration(account.age, 's').humanize()}
          </div>
        </div>
        <h3 className='ui pink dividing header'>
          Access
        </h3>
        <div className='ui list'>
          {account.access.map(item => (
            <div key={item} className='item'>
              <i className='icon green check' />
              <div className='content'>
                {ACCESS_TEXT[item]}
              </div>
            </div>
          ))}
        </div>
        <h3 className='ui pink dividing header'>
          Level
        </h3>
        <div className='ui list'>
          {LEVEL_TYPE.map(type => (
            <div key={type} className='item'>
              <span className='ui pink basic horizontal label'>
                {LEVEL_TEXT[type]}
              </span>
              {account[type]}
            </div>
          ))}
        </div>
        <h3 className='ui pink dividing header'>
          Bonus
        </h3>
        <div className='ui list'>
          <div className='item'>
            <span className='ui pink basic horizontal label'>
              Magic find
            </span>
            {magicFind} %
          </div>
        </div>
        <h3 className='ui pink dividing header'>
          Guilds
        </h3>
        <div className='ui list'>
          {account.guilds.map(id => (
            <div key={id} className='item'>
              <span className='ui pink basic horizontal label'>
                {guilds[id] ? guilds[id].tag : 'loading...'}
              </span>
              {guilds[id] ? guilds[id].name : 'loading...'}
              {account.guild_leader && account.guild_leader.includes(id) ? ' (leader)' : null}
            </div>
          ))}
        </div>
      </div>
      <div className='eight wide column'>
        <h3 className='ui pink dividing header'>
          Home nodes
        </h3>
        <div name='node' className='ui list'>
          {accountHomeNodes && accountHomeNodes.map(item => (
            <div key={item.id} className={`${item.style} item`}>
              <i className={`icon ${item.icon}`} />
              <div className='content'>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overview
