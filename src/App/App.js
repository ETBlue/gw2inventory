import React, {useContext, useEffect, useCallback} from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'

import {SystemContext} from '../_context/SystemContext'

import './App.scss'

const App = (props) => {
  const {items, getItems} = useContext(SystemContext)
  return (
    <div className='App'>
    </div>
  )
}

export default withRouter(App)
