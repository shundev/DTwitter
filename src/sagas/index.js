import getWeb3 from '../getWeb3'
import { takeEvery, takeLatest, take, select, fork, call, put, all } from 'redux-saga/effects'

import * as actionTypes from '../constants/actionTypes'
import { dmsgContract } from '../contracts'
import store from '../store'

function* watchAndLog() {
  while (true) {
    const action = yield take('*')
    const state = yield select()
    console.log('action', action)
  }
}

function* fetchHistoryAsync (action)
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
        type: actionTypes.FETCH_HISTORY_SUCCESS,
        payload: messages.map(msg => {
            return {
            Id: msg[0],
            Who: msg[1],
            What: msg[3],
            When: msg[4]
        }}).sort(messageComparer)
    })
}

function* sendMessageAsync (action)
{
    const { contractInstance, userAddress, friendAddress } = yield select()

    // マイニング完了まで表示する仮メッセージ
    const dummyMsg = {
        Id: Math.floor(Math.random() * 100000000),
        Who: userAddress,
        What: action.payload,
        When: (new Date().valueOf()) / 1000
    }
    yield put({ type: ADD_MESSAGE, payload: dummyMsg })

    // 本メッセージを送信
    yield sendMessage(contractInstance, userAddress, friendAddress, action.payload)
}

function* fetchWeb3ConnectionAsync() {
    yield take(actionTypes.FETCH_WEB3_CONNECTION_REQUESTED)
    const { web3 } = yield getWeb3
    const accounts = yield getAccounts
    const instance = web3.eth.contract(dmsgContract.abi).at(dmsgContract.address)

    instance.MessageSent({recipient: accounts[0]})
    .watch((err, result) => {
        store.dispatch({ type: actionTypes.FETCH_HISTORY_REQUESTED})
    })

    instance.MessageSent({sender: accounts[0]})
    .watch((err, result) => {
        store.dispatch({ type: actionTypes.FETCH_HISTORY_REQUESTED})
    })

    yield put({
        type: actionTypes.FETCH_WEB3_CONNECTION_SUCCESS,
        web3: web3,
        userAddress: accounts[0],
        contractInstance: instance
    })

    yield put({ type: actionTypes.FETCH_HISTORY_REQUESTED })
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

const sendMessage = (dmsgContractInstance, userAddress, friendAddress, message) => {
    return new Promise(function(resolve, reject) {
        dmsgContractInstance.sendMessage.sendTransaction(
            friendAddress,
            message,
            {from: userAddress},
            (err, result) => { resolve(result) }
        )
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
    yield takeLatest(actionTypes.FETCH_HISTORY_REQUESTED, fetchHistoryAsync)
    yield takeEvery(actionTypes.SEND_MESSAGE_REQUESTED, sendMessageAsync)
    yield fork(fetchWeb3ConnectionAsync)
    yield fork(watchAndLog)
}
