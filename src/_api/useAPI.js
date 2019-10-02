import {useState, useCallback} from 'react'
import queryString from 'query-string'
import axios from 'axios'

import {API_SERVER, TIMEOUT_IN_SECONDS, AMOUNT_PER_PAGE} from '../SETTINGS'

// set default params

const httpClient = axios.create()
httpClient.defaults.baseURL = API_SERVER
httpClient.defaults.timeout = TIMEOUT_IN_SECONDS * 1000

// for multiple ids

const getIdGroup = (ids) => {
  const groupCount = Math.ceil(ids.length / AMOUNT_PER_PAGE)
  const groups = []
  for (let i = 0; i < groupCount; i++) {
    groups.push(ids.slice(i * AMOUNT_PER_PAGE, (i + 1) * AMOUNT_PER_PAGE))
  }
  return groups
}

// for all requests

const getPath = ({endpoint, query, id, token}) => {
  let params = query || token ? {} : null
  if (query) {
    params = {...query}
  }
  if (token) {
    params.access_token = token
  }

  let path = endpoint
  if (params) {
    path += `?${queryString.stringify(params)}`
  }
  if (id !== undefined) {
    return path.replace(':id', id)
  } else {
    return path
  }
}

// the api hook

const useAPI = ({endpoint, token}) => {
  const [status, setStatus] = useState('ready')
  const [resData, setResData] = useState(undefined)
  const [errorData, setErrorData] = useState(undefined)

  const fetchData = async ({url, done, error}) => {
    await httpClient.get(url).then(res => {
      setResData(res.data)
      if (done) {
        done(res.data)
      }
      setStatus('ready')
    }).catch(err => {
      setErrorData(err)
      if (error) {
        error(err)
      }
      setStatus('error')
    })
  }

  const call = useCallback(async ({id, ids, done, error, query}) => {
    setStatus('loading')

    if (ids) {
      const groups = getIdGroup(ids)
      for (const group of groups) {
        const url = getPath({
          endpoint,
          query: {ids: group.join(',')},
          token
        })
        await fetchData({url, done, error})
      }
    } else {
      const url = getPath({
        endpoint,
        query,
        id,
        token
      })
      await fetchData({url, done, error})
    }
  }, [endpoint, token, fetchData])

  return {status, resData, errorData, call}
}

export default useAPI
