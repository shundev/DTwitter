import { takeEvery, takeLatest, take, select } from 'redux-saga/effects'

import { FETCH_HISTORY_REQUESTED, SEND_MESSAGE_REQUESTED, FETCH_WEB3_CONNECTION_REQUESTED } from '../constants'

function* watchAndLog() {
  while (true) {
    const action = yield take('*')
    const state = yield select()
    console.log('action', action)
    console.log('state after', state)
  }
}

function* fetchHistory ()
{
}

function* sendMessage ()
{
}

function* watchFetchHistoryRequest() {
    yield takeLatest(FETCH_HISTORY_REQUESTED, fetchHistory)
}

function* watchSendMessageRequest() {
    yield takeEvery(SEND_MESSAGE_REQUESTED, sendMessage)
}

function* fetchWeb3Connection() {
    yield take(FETCH_WEB3_CONNECTION_REQUESTED)
}

export default function* rootSaga ()
{
    yield watchSendMessageRequest()
    yield watchFetchHistoryRequest()
    yield watchAndLog()
}
