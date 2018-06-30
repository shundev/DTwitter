import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'

import dmsgReducer from './reducers'

export const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  dmsgReducer,
  applyMiddleware(sagaMiddleware)
);
