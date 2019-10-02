import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

import getDictionary from '../_func/getDictionary'

const getMissingIdSet = ({list, dictionary}) => {
  const idSet = new Set(list)
  for (const id in dictionary) {
    idSet.delete(id)
  }
  return {size: idSet.size, set: idSet}
}

const useAchievements = (token) => {
  // setup account achievements data

  const [accountTitles, setAccountTitles] = useState([])
  const [accountAchievements, setAccountAchievements] = useState([])

  // setup account achievements api

  const accountTitleList = useAPI({
    endpoint: 'account/titles',
    token
  })
  const accountAchievementList = useAPI({
    endpoint: 'account/achievements',
    token
  })

  // refresh account achievements on token change

  const fetchAchievements = async () => {
    await accountTitleList.call({
      done: (data) => {
        setAccountTitles(data)
      }
    })
    await accountAchievementList.call({
      done: (data) => {
        setAccountAchievements(data)
      }
    })
  }

  useEffect(() => {
    if (!token) {
      return
    }
    fetchAchievements()
  }, [token])

  // setup global achievements data

  const [titles, setTitles] = useState({})
  const [achievements, setAchievements] = useState({})

  // setup global achievements api

  const titleList = useAPI({
    endpoint: '/titles'
  })
  const achievementList = useAPI({
    endpoint: '/achievements'
  })

  // refresh global achievements on account achievements change

  useEffect(() => {
    const {size, set} = getMissingIdSet({
      list: accountTitles,
      dictionary: titles
    })
    if (size > 0) {
      const idMissing = Array.from(set)
      titleList.call({
        ids: idMissing,
        done: (data) => {
          setTitles(prev => {
            return {...prev, ...getDictionary(data)}
          })
        }
      })
    }
  }, [accountTitles])

  useEffect(() => {
    const {size, set} = getMissingIdSet({
      list: accountAchievements.map(item => item.id),
      dictionary: achievements
    })
    if (size > 0) {
      const idMissing = Array.from(set)
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

  return {accountAchievements, achievements, accountTitles, titles}
}

export default useAchievements
