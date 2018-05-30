import getWeb3 from '../getWeb3'
import { takeEvery, takeLatest, take, select, fork, call, put } from 'redux-saga/effects'

import {
    FETCH_HISTORY_REQUESTED,
    SEND_MESSAGE_REQUESTED,
    FETCH_WEB3_CONNECTION_REQUESTED,
    FETCH_WEB3_CONNECTION_SUCCESS
} from '../constants'
import { dmsgContract } from '../contracts'

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
    const { web3 } = yield getWeb3
    const accounts = yield getAccounts
    const instance = web3.eth.contract(dmsgContract.abi).at(dmsgContract.address)

    instance.MessageSent({recipient: accounts[0]})
    .watch((err, result) => {
        put({ type: FETCH_HISTORY_REQUESTED })
    })

    instance.MessageSent({sender: accounts[0]})
    .watch((err, result) => {
        put({ type: FETCH_HISTORY_REQUESTED })
    })

    yield put({
        type: FETCH_WEB3_CONNECTION_SUCCESS,
        web3: web3,
        userAddress: accounts[0],
        contractInstance: instance
    })
}

const getAccounts = new Promise(function(resolve, reject) {
    web3.eth.getAccounts((err, result) => resolve(result))
})

export default function* rootSaga ()
{
    yield fork(fetchWeb3Connection)
    yield fork(watchAndLog)
    yield fork(watchSendMessageRequest)
    yield fork(watchFetchHistoryRequest)
}
