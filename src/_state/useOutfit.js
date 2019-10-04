import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

const useOutfit = (token) => {
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

  return {accountOutfits}
}

export default useOutfit
