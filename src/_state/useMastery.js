import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

const useMastery = (token) => {
  const [accountMasteries, setAccountMasteries] = useState([])

  const accountMasteryList = useAPI({
    endpoint: 'account/masteries',
    token
  })

  const fetchMasteries = async () => {
    await accountMasteryList.call({
      done: (data) => {
        setAccountMasteries(data)
      }
    })
  }

  useEffect(() => {
    if (!token) {
      return
    }
    fetchMasteries()
  }, [token])

  return {accountMasteries}
}

export default useMastery
