import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route,  browserHistory, hashHistory  } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import * as reducers from './reducers/webviewer'


import App from './components/App';
import Lobby from './components/Lobby';
import Viewer from './components/Viewer';


const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
)

const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
  <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Viewer} />
        <Route path="viewer" component={Viewer} />
        <Route path="lobby" component={Lobby} />
      </Router>
  </Provider>,
  document.getElementById('jwviewer')
)

