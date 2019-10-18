import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

const useGlider = (token) => {
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

  return {accountGliders}
}

export default useGlider
