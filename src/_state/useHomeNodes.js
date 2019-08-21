import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

const useHomeNodes = (token) => {
  // home nodes

  const [homeNodes, setHomeNodes] = useState(undefined)
  const nodeList = useAPI({
    endpoint: '/home/nodes'
  })

  useEffect(() => {
    nodeList.call({
      done: (data) => {
        setHomeNodes(data)
      }
    })
  }, [])

  const [accountHomeNodes, setAccountHomeNodes] = useState(undefined)
  const accountNodeList = useAPI({
    endpoint: '/account/home/nodes',
    token
  })

  useEffect(() => {
    if (!token || !homeNodes) {
      return
    }

    accountNodeList.call({
      done: (data) => {
        const parsedNodes = homeNodes.map(id => {
          return {
            id,
            name: id.split('_').join(' '),
            icon: data.includes(id) ? 'green check' : 'minus',
            style: data.includes(id) ? '' : 'disabled'
          }
        })
        setAccountHomeNodes(parsedNodes)
      }
    })
  }, [token, homeNodes])

  return {accountHomeNodes}
}

export default useHomeNodes
