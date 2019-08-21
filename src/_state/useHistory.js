import {useState, useEffect} from 'react'

import {LOCAL_STORAGE_KEY} from '../SETTINGS'

const getStorage = () => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (storage) {
    const parsedStorage = JSON.parse(storage)
    console.log(parsedStorage)
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

const useHistory = ({account, token}) => {
  // setup account history

  const [history, setHistory] = useState([])

  // read history from local storage

  useEffect(() => {
    // handle local storage from previous version

    const oldStorage = localStorage.getItem('gw2apikey')
    console.log(oldStorage)
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
    console.log([...newHistory])
    setStorage('history', newHistory)
    setHistory(newHistory)
  }, [account])

  return {history}
}

export default useHistory
