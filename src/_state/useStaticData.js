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

  // outfits

  const [outfits, setOutfits] = useState({})

  const outfitList = useAPI({
    endpoint: '/outfits'
  })

  useEffect(() => {
    outfitList.call({
      query: {ids: 'all'},
      done: (data) => {
        setOutfits(getDictionary(data))
      }
    })
  }, [])

  // gliders

  const [gliders, setGliders] = useState({})

  const gliderList = useAPI({
    endpoint: '/gliders'
  })

  useEffect(() => {
    gliderList.call({
      query: {ids: 'all'},
      done: (data) => {
        setGliders(getDictionary(data))
      }
    })
  }, [])

  // minis

  const [minis, setMinis] = useState({})

  const miniList = useAPI({
    endpoint: '/minis'
  })

  useEffect(() => {
    miniList.call({
      query: {ids: 'all'},
      done: (data) => {
        setMinis(getDictionary(data))
      }
    })
  }, [])

  // mailcarriers

  const [mailcarriers, setMailcarriers] = useState({})

  const mailCarrierList = useAPI({
    endpoint: '/mailcarriers'
  })

  useEffect(() => {
    mailCarrierList.call({
      query: {ids: 'all'},
      done: (data) => {
        setMailcarriers(getDictionary(data))
      }
    })
  }, [])

  // finishers
  // novelties

  const [novelties, setNovelty] = useState({})

  const noveltyList = useAPI({
    endpoint: '/novelties'
  })

  useEffect(() => {
    noveltyList.call({
      query: {ids: 'all'},
      done: (data) => {
        setNovelty(getDictionary(data))
      }
    })
  }, [])

  return {
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
  }
}

export default useStaticData
