import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

const useFashion = (token) => {
  // outfits

  const [accountOutfits, setAccountOutfits] = useState([])

  const accountOutfitList = useAPI({
    endpoint: 'account/outfits',
    token
  })

  const fetchOutfits = async () => {
    await accountOutfitList.call({
      done: (data) => {
        setAccountOutfits(data)
      }
    })
  }

  useEffect(() => {
    if (!token) {
      return
    }
    fetchOutfits()
  }, [token])

  // gliders

  const [accountGliders, setAccountGliders] = useState([])

  const accountGliderList = useAPI({
    endpoint: 'account/gliders',
    token
  })

  const fetchGliders = async () => {
    await accountGliderList.call({
      done: (data) => {
        setAccountGliders(data)
      }
    })
  }

  useEffect(() => {
    if (!token) {
      return
    }
    fetchGliders()
  }, [token])

  // minis

  const [accountMinis, setAccountMinis] = useState([])

  const accountMiniList = useAPI({
    endpoint: 'account/minis',
    token
  })

  const fetchMinis = async () => {
    await accountMiniList.call({
      done: (data) => {
        setAccountMinis(data)
      }
    })
  }

  useEffect(() => {
    if (!token) {
      return
    }
    fetchMinis()
  }, [token])

  // mailcarriers

  const [accountMailcarriers, setAccountMailcarriers] = useState([])

  const accountMailcarrierList = useAPI({
    endpoint: 'account/mailcarriers',
    token
  })

  const fetchMailcarriers = async () => {
    await accountMailcarrierList.call({
      done: (data) => {
        setAccountMailcarriers(data)
      }
    })
  }

  useEffect(() => {
    if (!token) {
      return
    }
    fetchMailcarriers()
  }, [token])

  // novelties

  const [accountNovelties, setAccountNovelties] = useState([])

  const accountNoveltyList = useAPI({
    endpoint: 'account/novelties',
    token
  })

  const fetchNovelties = async () => {
    await accountNoveltyList.call({
      done: (data) => {
        setAccountNovelties(data)
      }
    })
  }

  useEffect(() => {
    if (!token) {
      return
    }
    fetchNovelties()
  }, [token])

  return {
    accountOutfits,
    accountGliders,
    accountMounts,
    accountMinis,
    accountMailcarriers,
    accountNovelties
  }
}

export default useFashion
