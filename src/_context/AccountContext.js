import React, {useState, useEffect, useCallback} from 'react'

import useAPI from '../_api/useAPI'

import {LOCAL_STORAGE_KEY, APP_NAME} from '../SETTINGS'

const AccountContext = React.createContext()

const getStorage = () => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (storage) {
    const parsedStorage = JSON.parse(storage)
    return parsedStorage
  } else {
    return {}
  }
}

const setStorage = (key, object) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
    [key]: object
  }))
}

const AccountContextProvider = (props) => {
  // setup account history

  const [history, setHistory] = useState([])

  // read history from local storage

  useEffect(() => {
    // handle local storage from previous version

    const oldStorage = localStorage.getItem('gw2apikey')
    if (oldStorage) {
      const {recent} = JSON.parse(oldStorage)

      const oldHostory = []
      for (const token in recent) {
        oldHostory.push({
          token,
          name: recent[token]
        })
      }
      setStorage('history', oldHostory)
      localStorage.removeItem('gw2apikey')
    }

    // read account history normally

    const storage = getStorage()
    if (storage && storage.history) {
      setHistory(storage.history)
    }
  }, [])

  // identify current user

  const [token, setToken] = useState(undefined)
  const [account, setAccount] = useState(undefined)

  const accountInfo = useAPI({
    endpoint: '/account',
    token
  })

  const getAccountInfo = useCallback(async () => {
    await accountInfo.call({
      done: async (data) => {
        setAccount(data)
        document.title = `${data.name} | ${APP_NAME}`
      }
    })
  }, [accountInfo])

  const adoptToken = useCallback((string) => {
    setToken(string)
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }
    getAccountInfo()
  }, [token])

  // update history on user change

  useEffect(() => {
    if (!account) {
      return
    }

    const newHistory = history.filter(item => item.token && item.token !== token)
    newHistory.unshift({
      token,
      name: account.name
    })
    setStorage('history', newHistory)
    setHistory(newHistory)
  }, [account])

  // update guild dictionary on user change

  const [guilds, setGuilds] = useState({})
  const guildInfo = useAPI({
    endpoint: '/guild/:id'
  })

  const fetchGuilds = useCallback(async () => {
    const guildsToGet = account.guilds.filter(id => guilds[id] === undefined)
    const newGuilds = {}
    for (const id of guildsToGet) {
      await guildInfo.call({
        id,
        done: (data) => {
          newGuilds[id] = data
        }
      })
    }
    setGuilds(prev => {
      return {...prev, ...newGuilds}
    })
  }, [account, guilds, guildInfo])

  useEffect(() => {
    if (!account) {
      return
    }
    fetchGuilds()
  }, [account])

  // render

  return (
    <AccountContext.Provider value={{
      history,
      account,
      getAccountInfo,
      guilds,
      token,
      adoptToken
    }}>
      {props.children}
    </AccountContext.Provider>
  )
}

export {AccountContext, AccountContextProvider}
