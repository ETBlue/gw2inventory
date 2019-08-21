import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

import getDictionary from '../_func/getDictionary'
import getIdGroup from '../_func/getIdGroup'

const useAchievements = ({account, token}) => {
  const [accountAchievements, setAccountAchievements] = useState([])

  const accountAchievementList = useAPI({
    endpoint: 'account/achievements',
    token
  })

  useEffect(() => {
    if (!token || !account) {
      return
    }
    accountAchievementList.call({
      done: (data) => {
        setAccountAchievements(data)
      }
    })
  }, [account])

  const [achievements, setAchievements] = useState({})
  const achievementList = useAPI({
    endpoint: '/achievements'
  })

  useEffect(() => {
    if (!token || !account) {
      return
    }

    const getAchievements = async ({ids = [], done, error}) => {
      const groups = getIdGroup(ids)

      for (const group of groups) {
        await achievementList.call({
          query: {ids: group.join(',')},
          done: (data) => {
            setAchievements(prev => {
              return {...prev, ...getDictionary(data)}
            })
          }
        })
      }
    }
    getAchievements({ids: accountAchievements.map(item => item.id)})
  }, [accountAchievements])

  return {accountAchievements, achievements}
}

export default useAchievements
