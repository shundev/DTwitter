import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { store, sagaMiddleware } from './store'
import rootSage from './sagas'
import App from './components/App'

sagaMiddleware.run(rootSage);

ReactDOM.render(
  <Provider store={ store }>
      <App />
  </Provider>,
  document.getElementById('root')
)
