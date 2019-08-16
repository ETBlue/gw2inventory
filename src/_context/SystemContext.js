import React, {useState, useCallback} from 'react'

import {AMOUNT_PER_PAGE} from '../SETTINGS'
import useAPI from '../_api/useAPI'

const SystemContext = React.createContext()

const SystemContextProvider = (props) => {
  // items

  const [items, setItems] = useState({})
  const itemList = useAPI({
    endpoint: '/items'
  })

  const getItems = useCallback(async ({ids = [], done, error}) => {
    const groupCount = Math.ceil(ids.length / AMOUNT_PER_PAGE)
    const groups = []
    for (let i = 0; i < groupCount; i++) {
      groups.push(ids.slice(i * AMOUNT_PER_PAGE, (i + 1) * AMOUNT_PER_PAGE))
    }

    for (const group of groups) {
      await itemList.call({
        query: `ids=${group.join(',')}`,
        done: (data) => {
          const newItems = {}
          for (const item of data) {
            newItems[item.id] = item
          }
          setItems(prev => {
            return {...prev, ...newItems}
          })
          if (done) {
            done(data)
          }
        },
        error
      })
    }
  }, [itemList])

  return (
    <SystemContext.Provider value={{
      items,
      getItems
    }}>
      {props.children}
    </SystemContext.Provider>
  )
}

export {SystemContext, SystemContextProvider}
