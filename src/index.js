import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'

import dmsgReducer from './reducers'
import rootSage from './sagas'
import App from './App';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  dmsgReducer,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSage);

ReactDOM.render(
  <Provider store={ store }>
      <App />
  </Provider>,
  document.getElementById('root')
);
