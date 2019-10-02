import {useState, useCallback} from 'react'

import useAPI from '../_api/useAPI'

import getDictionary from '../_func/getDictionary'

const useItems = () => {
  // setup item dictionary

  const [items, setItems] = useState({})

  // fetch items

  const itemList = useAPI({
    endpoint: '/items'
  })

  const fetchItems = useCallback(async ({ids, done, error}) => {
    await itemList.call({
      ids,
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
  }, [itemList])

  return {items, fetchItems}
}

export default useItems
