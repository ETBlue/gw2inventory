import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router} from 'react-router-dom'

import {SystemContextProvider} from './_context/SystemContext'
import {AccountContextProvider} from './_context/AccountContext'
import {App} from './App'
import './index.scss'

import * as serviceWorker from './serviceWorker'

ReactDOM.render((
  <Router>
    <AccountContextProvider>
      <SystemContextProvider>
        <App />
      </SystemContextProvider>
    </AccountContextProvider>
  </Router>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
