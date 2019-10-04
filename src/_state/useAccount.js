import {useState, useEffect, useCallback} from 'react'

import {APP_NAME} from '../SETTINGS'
import useAPI from '../_api/useAPI'

const useAccount = () => {
  // setup account data

  const [token, setToken] = useState(undefined)
  const [account, setAccount] = useState(undefined)

  // setup account api

  const accountInfo = useAPI({
    endpoint: '/account',
    token
  })

  const fetchAccountInfo = useCallback(async () => {
    await accountInfo.call({
      done: async (data) => {
        setAccount(data)
        document.title = `${data.name} | ${APP_NAME}`
      }
    })
  }, [accountInfo])

  // fetch account data on token change

  useEffect(() => {
    if (!token) {
      return
    }
    fetchAccountInfo()
  }, [token])

  return {
    account,
    token,
    setToken,
    fetchAccountInfo
  }
}

export default useAccount
