import {useState, useCallback} from 'react'
import axios from 'axios'

import {API_SERVER, TIMEOUT_IN_SECONDS} from '../SETTINGS'

const httpClient = axios.create()
httpClient.defaults.timeout = TIMEOUT_IN_SECONDS * 1000

const getPath = ({endpoint, query, id = undefined}) => {
  const params = query ? `?${query}` : ''
  const path = endpoint + params
  if (id !== undefined) {
    return API_SERVER + path.replace(':id', id)
  }
  return API_SERVER + path
}

const useAPI = ({endpoint}) => {
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
    const url = getPath({endpoint, query, id})

    setStatus('loading')
    await httpClient.get(url).then(res => {
      handleResponse({res: res.data, done})
    }).catch(err => {
      handleException({err, error})
    })
  }, [endpoint, handleException, handleResponse])

  return {status, resData, errorData, call}
}

export default useAPI
