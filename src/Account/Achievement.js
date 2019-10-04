import React, {useContext, useState, useEffect} from 'react'

import {AccountContext} from '../_context/AccountContext'
import {SystemContext} from '../_context/SystemContext'

const Achievement = () => {
  const {achievementCategories, achievementGroups} = useContext(SystemContext)
  const {accountAchievements, achievements, accountTitles, titles} = useContext(AccountContext)

  const [selectedAchievementsTitle, setSelectedAchievementsTitle] = useState('All')
  const [selectedAchievements, setSelectedAchievements] = useState(accountAchievements)
  useEffect(() => {
    setSelectedAchievements(accountAchievements)
  }, [accountAchievements])

  const handleGroupSelect = e => {
    const groupId = e.currentTarget.dataset.id
    if (groupId) {
      const selectedGroup = achievementGroups.find(grp => grp.id === groupId)
      let selectedAchs = []
      for (const catId of selectedGroup.categories) {
        const currentCat = achievementCategories.find(cat => cat.id === catId)
        selectedAchs = [...selectedAchs, ...currentCat.achievements]
      }
      const newAccountAchievements = accountAchievements.filter(ach => selectedAchs.includes(ach.id))
      setSelectedAchievements(newAccountAchievements)

      const groupName = e.currentTarget.dataset.name
      setSelectedAchievementsTitle(groupName)
    } else {
      setSelectedAchievements(accountAchievements)
      setSelectedAchievementsTitle('All')
    }
  }

  return (
    <div id='Achievement' className='ui two column stackable grid'>
      <div className='column'>
        <h3 className='ui pink dividing header'>
          Titles
        </h3>
        <div className='ui list'>
          {accountTitles.map(id => titles[id] && (
            <div key={id} className='item'>
              <i className='icon green check' />
              <div className='content'>
                <div className='header'>
                  {titles[id] && titles[id].name}
                </div>
                {titles[id] && titles[id].ap_required ? (
                  <div className='description'>
                    Points required: {titles[id].ap_required}
                  </div>
                ) : null}
                {titles[id] && titles[id].achievements && titles[id].achievements.map(id => {
                  return achievements[id] ? (
                    <React.Fragment key={id}>
                      <div className='description'>
                        Achievement: {achievements[id].name}
                      </div>
                      {achievements[id].requirement.length === 0 ? (
                        <div className='description'>
                          Description: {achievements[id].description}
                        </div>
                      ) : null}
                      {achievements[id].requirement.length > 0 ? (
                        <div className='description'>
                          Aquired by: {achievements[id].requirement}
                        </div>
                      ) : null}
                    </React.Fragment>
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='column'>
        <h3 className='ui pink dividing header'>
          Achievements
          <div className='ui right floated simple selection dropdown'>
            {selectedAchievementsTitle}
            <i className='icon dropdown' />
            <div className='menu'>
              <div className='item'
                onClick={handleGroupSelect} >
                All
              </div>
              {achievementGroups.map(group => (
                <div key={group.id} className='item'
                  data-id={group.id}
                  data-name={group.name}
                  onClick={handleGroupSelect} >
                  {group.name}
                </div>
              ))}
            </div>
          </div>
        </h3>
        <div className='ui list'>
          {selectedAchievements.map(item => achievements[item.id] && (
            <div key={item.id} className='item'>
              <i className={`icon ${item.done ? 'green check' : 'yellow circle'}`} />
              <div className='content'>
                {achievements[item.id].name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Achievement
