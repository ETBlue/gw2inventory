import {useState, useEffect, useCallback} from 'react'

import {APP_NAME} from '../SETTINGS'
import useAPI from '../_api/useAPI'

const useAccountData = () => {
  // identify current user

  const [token, setToken] = useState(undefined)
  const [account, setAccount] = useState(undefined)

  const accountInfo = useAPI({
    endpoint: '/account',
    token
  })

  const adoptToken = useCallback((string) => {
    setToken(string)
  }, [])

  const getAccountInfo = useCallback(async () => {
    await accountInfo.call({
      done: async (data) => {
        setAccount(data)
        document.title = `${data.name} | ${APP_NAME}`
      }
    })
  }, [accountInfo])

  useEffect(() => {
    if (!token) {
      return
    }
    getAccountInfo()
  }, [token])

  return {
    account,
    token,
    adoptToken,
    getAccountInfo
  }
}

export default useAccountData
