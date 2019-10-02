import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

import getDictionary from '../_func/getDictionary'

const useAchievements = (token) => {
  // setup account achievements data

  const [accountAchievements, setAccountAchievements] = useState([])

  // setup account achievements api

  const accountAchievementList = useAPI({
    endpoint: 'account/achievements',
    token
  })

  // refresh account achievements on token change

  useEffect(() => {
    if (!token) {
      return
    }
    accountAchievementList.call({
      done: (data) => {
        setAccountAchievements(data)
      }
    })
  }, [token])

  // setup global achievements data

  const [achievements, setAchievements] = useState({})

  // setup global achievements api

  const achievementList = useAPI({
    endpoint: '/achievements'
  })

  // refresh global achievements on account achievements change

  useEffect(() => {
    const idSet = new Set(accountAchievements.map(item => item.id))
    for (const id in achievements) {
      idSet.delete(id)
    }
    if (idSet.size > 0) {
      const idMissing = Array.from(idSet)
      achievementList.call({
        ids: idMissing,
        done: (data) => {
          setAchievements(prev => {
            return {...prev, ...getDictionary(data)}
          })
        }
      })
    }
  }, [accountAchievements])

  return {accountAchievements, achievements}
}

export default useAchievements
