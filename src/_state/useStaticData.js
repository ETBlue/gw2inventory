import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

import getDictionary from '../_func/getDictionary'

const useStaticData = () => {
  // worlds

  const [worlds, setWorlds] = useState({})
  const worldList = useAPI({
    endpoint: '/worlds'
  })

  useEffect(() => {
    worldList.call({
      query: {ids: 'all'},
      done: (data) => {
        setWorlds(getDictionary(data))
      }
    })
  }, [])

  // files

  const [files, setFiles] = useState({})
  const fileList = useAPI({
    endpoint: '/files'
  })

  useEffect(() => {
    fileList.call({
      query: {ids: 'all'},
      done: (data) => {
        setFiles(getDictionary(data))
      }
    })
  }, [])

  // achievements

  const [achievementCategories, setAchievementCategories] = useState([])
  const [achievementGroups, setAchievementGroups] = useState([])

  const acCategoryList = useAPI({
    endpoint: '/achievements/categories'
  })
  const acGroupList = useAPI({
    endpoint: '/achievements/groups'
  })

  useEffect(() => {
    acCategoryList.call({
      query: {ids: 'all'},
      done: (data) => {
        setAchievementCategories(data)
      }
    })
    acGroupList.call({
      query: {ids: 'all'},
      done: (data) => {
        setAchievementGroups(data)
      }
    })
  }, [])

  // masteries

  const [masteries, setMasteries] = useState([])

  const masteryList = useAPI({
    endpoint: '/masteries'
  })

  useEffect(() => {
    masteryList.call({
      query: {ids: 'all'},
      done: (data) => {
        setMasteries(data)
      }
    })
  }, [])

  return {
    worlds,
    files,
    achievementCategories,
    achievementGroups,
    masteries
  }
}

export default useStaticData
