import React from 'react'

import useStaticData from '../_state/useStaticData'

const SystemContext = React.createContext()

const SystemContextProvider = (props) => {
  // static data

  const {
    worlds,
    files,
    achievementCategories,
    achievementGroups,
    masteries,
    outfits,
    gliders,
    minis,
    mailcarriers,
    novelties
  } = useStaticData()

  return (
    <SystemContext.Provider value={{
      worlds,
      files,
      achievementCategories,
      achievementGroups,
      masteries,
      outfits,
      gliders,
      minis,
      mailcarriers,
      novelties
    }}>
      {props.children}
    </SystemContext.Provider>
  )
}

export {SystemContext, SystemContextProvider}
