import {useState, useCallback} from 'react'

import useAPI from '../_api/useAPI'

import getDictionary from '../_func/getDictionary'
import getIdGroup from '../_func/getIdGroup'

const useItems = () => {
  const [items, setItems] = useState({})
  const itemList = useAPI({
    endpoint: '/items'
  })

  const fetchItems = useCallback(async ({ids = [], done, error}) => {
    const groups = getIdGroup(ids)

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
            done(newItems)
          }
        },
        error
      })
    }
  }, [itemList])

  return {items, fetchItems}
}

export default useItems
