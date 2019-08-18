import {useState, useCallback} from 'react'
import queryString from 'query-string'
import axios from 'axios'

import {API_SERVER, TIMEOUT_IN_SECONDS} from '../SETTINGS'

const httpClient = axios.create()
httpClient.defaults.baseURL = API_SERVER
httpClient.defaults.timeout = TIMEOUT_IN_SECONDS * 1000

const getPath = ({endpoint, query, id = undefined, token}) => {
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

const useAPI = ({endpoint, token}) => {
  const [status, setStatus] = useState('ready')
  const [resData, setResData] = useState(undefined)
  const [errorData, setErrorData] = useState(undefined)

  const handleResponse = useCallback(({res, done}) => {
    setResData(res)
    if (done) {
      done(res)
    }
    setStatus('ready')
  }, [])

  const handleException = useCallback(({err, error}) => {
    setErrorData(err)
    if (error) {
      error(err)
    }
    setStatus('error')
  }, [])

  const call = useCallback(async ({id, done, error, query}) => {
    const url = getPath({endpoint, query, id, token})

    setStatus('loading')
    await httpClient.get(url).then(res => {
      handleResponse({res: res.data, done})
    }).catch(err => {
      handleException({err, error})
    })
  }, [endpoint, handleException, handleResponse, token])

  return {status, resData, errorData, call}
}

export default useAPI
