import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

const useGuilds = (accountGuilds) => {
  // update guild dictionary on user change

  const [guilds, setGuilds] = useState({})
  const guildInfo = useAPI({
    endpoint: '/guild/:id'
  })

  useEffect(() => {
    if (!accountGuilds) {
      return
    }

    const fetchGuilds = async () => {
      const newGuilds = {}
      for (const id of accountGuilds) {
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
    }
    fetchGuilds()
  }, [accountGuilds])

  return {guilds}
}

export default useGuilds
