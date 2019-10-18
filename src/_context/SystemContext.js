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
    }}>
      {props.children}
    </SystemContext.Provider>
  )
}

export {SystemContext, SystemContextProvider}
