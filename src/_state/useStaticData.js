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

  // mounts

  const [mountTypes, setMountTypes] = useState([])

  const mountTypeList = useAPI({
    endpoint: '/mounts/types'
  })
  const mountSkinList = useAPI({
    endpoint: '/mounts/skins'
  })

  const fetchMount = async () => {
    let skins
    await mountSkinList.call({
      query: {ids: 'all'},
      done: (data) => {
        skins = getDictionary(data)
      }
    })
    await mountTypeList.call({
      query: {ids: 'all'},
      done: (data) => {
        setMountTypes(data.map(type => {
          type.dictionary = getDictionary(type.skins.map(id => skins[id]))
          return type
        }))
      }
    })
  }

  useEffect(() => {
    fetchMount()
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

  const [novelties, setNovelty] = useState([])

  const noveltyList = useAPI({
    endpoint: '/novelties'
  })

  useEffect(() => {
    noveltyList.call({
      query: {ids: 'all'},
      done: (data) => {
        const types = {}
        for (const item of data) {
          if (!types[item.slot]) {
            types[item.slot] = []
          }
          types[item.slot].push(item)
        }

        const result = Object.keys(types)
          .sort((a, b) => {
            if (a > b) {
              return 1
            } else if (a < b) {
              return -1
            } else {
              return 0
            }
          })
          .map(type => {
            return {
              id: type,
              items: types[type].map(item => item.id),
              dictionary: getDictionary(types[type])
            }
          })

        setNovelty(result)
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
    mountTypes,
    minis,
    mailcarriers,
    novelties
  }
}

export default useStaticData
