import getWeb3 from '../getWeb3'
import { takeEvery, takeLatest, take, select, fork, call, put, all } from 'redux-saga/effects'

import {
    FETCH_HISTORY_REQUESTED,
    FETCH_HISTORY_SUCCESS,
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

function* fetchHistory (action)
{
    const { contractInstance, userAddress, friendAddress } = yield select()
    const messageIds = yield getMessages(contractInstance, userAddress, friendAddress)
    const getMessageWorkers = []
    for (var i=0; i<messageIds.length; i++) {
        if (messageIds[i] == 0) break;
        getMessageWorkers.push(call(getMessage, contractInstance, messageIds[i], userAddress))
    }

    const messages = yield all(getMessageWorkers)
    yield put({
        type: FETCH_HISTORY_SUCCESS,
        payload: messages.sort(messageComparer).map(msg => {
            return {
            Id: msg[0],
            Who: msg[1],
            What: msg[3],
            When: msg[4]
        }})
    })
}

function* sendMessage (action)
{
}

function* fetchWeb3Connection() {
    yield take(FETCH_WEB3_CONNECTION_REQUESTED)
    const { web3 } = yield getWeb3
    const accounts = yield getAccounts
    const instance = web3.eth.contract(dmsgContract.abi).at(dmsgContract.address)

    instance.MessageSent({recipient: accounts[0]})
    .watch((err, result) => {
        // yield put({ type: FETCH_HISTORY_REQUESTED })
    })

    instance.MessageSent({sender: accounts[0]})
    .watch((err, result) => {
        // yield put({ type: FETCH_HISTORY_REQUESTED })
    })

    yield put({
        type: FETCH_WEB3_CONNECTION_SUCCESS,
        web3: web3,
        userAddress: accounts[0],
        contractInstance: instance
    })

    yield put({ type: FETCH_HISTORY_REQUESTED })
}

const getAccounts = new Promise(function(resolve, reject) {
    web3.eth.getAccounts((err, result) => resolve(result))
})

const getMessage = (dmsgContractInstance, messageId, userAddress) => {
    return new Promise(function(resolve, rejest) {
        dmsgContractInstance.getMessage(messageId, {from: userAddress}, (err, message) => {
            resolve(message)
        })
    })
}

const getMessages = (dmsgContractInstance, userAddress, friendAddress) => {
    return new Promise(function(resolve, reject) {
        dmsgContractInstance.getMessages(friendAddress, {from: userAddress}, (err, messageIds) => {
            resolve(messageIds)
        })
    })
}

const messageComparer = (m1, m2) => {
    if (m1.When > m2.When) {
        return 1;
    } else if (m1.When < m2.When) {
        return -1;
    } else {
        return 0;
    }
}

export default function* rootSaga ()
{
    yield takeLatest(FETCH_HISTORY_REQUESTED, fetchHistory)
    yield takeEvery(SEND_MESSAGE_REQUESTED, sendMessage)
    yield fork(fetchWeb3Connection)
    yield fork(watchAndLog)
}
