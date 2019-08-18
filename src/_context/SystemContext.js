import React, {useState, useEffect, useCallback} from 'react'

import {AMOUNT_PER_PAGE} from '../SETTINGS'
import useAPI from '../_api/useAPI'

const getDictionary = (array, key = 'id') => {
  const result = {}
  for (const item of array) {
    result[item[key]] = item
  }
  return result
}

const SystemContext = React.createContext()

const SystemContextProvider = (props) => {
  // worlds

  const [worlds, setWorlds] = useState({})
  const worldList = useAPI({
    endpoint: '/worlds'
  })

  useEffect(() => {
    worldList.call({
      query: {
        ids: 'all'
      },
      done: (data) => {
        console.log(data)
        console.log(getDictionary(data))
        setWorlds(getDictionary(data))
      }
    })
  }, [])

  // items

  const [items, setItems] = useState({})
  const itemList = useAPI({
    endpoint: '/items'
  })

  const fetchItems = useCallback(async ({ids = [], done, error}) => {
    const groupCount = Math.ceil(ids.length / AMOUNT_PER_PAGE)
    const groups = []
    for (let i = 0; i < groupCount; i++) {
      groups.push(ids.slice(i * AMOUNT_PER_PAGE, (i + 1) * AMOUNT_PER_PAGE))
    }

    for (const group of groups) {
      await itemList.call({
        query: {
          ids: group.join(',')
        },
        done: (data) => {
          const newItems = getDictionary(data)
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
      worlds,
      fetchItems
    }}>
      {props.children}
    </SystemContext.Provider>
  )
}

export {SystemContext, SystemContextProvider}
