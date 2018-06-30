import getWeb3 from '../helpers/getWeb3'
import { takeEvery, takeLatest, take, select, fork, call, put, all } from 'redux-saga/effects'

import * as actionTypes from '../constants/actionTypes'
import { dtwitterContract } from '../contracts'
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
    const messageIds = yield getMessages(contractInstance, userAddress)
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
            What: msg[2],
            When: msg[3]
        }}).sort(messageComparer)
    })
}

function* sendMessageAsync (action)
{
    const { contractInstance, userAddress } = yield select()

    // マイニング完了まで表示する仮メッセージ
    const dummyMsg = {
        Id: Math.floor(Math.random() * 100000000),
        Who: userAddress,
        What: action.payload,
        When: (new Date().valueOf()) / 1000
    }
    yield put({ type: actionTypes.ADD_MESSAGE, payload: dummyMsg })

    // 本メッセージを送信
    yield sendMessage(contractInstance, userAddress, action.payload)
}

function* fetchWeb3ConnectionAsync() {
    yield take(actionTypes.FETCH_WEB3_CONNECTION_REQUESTED)
    const { web3 } = yield getWeb3
    const accounts = yield getAccounts
    const instance = web3.eth.contract(dtwitterContract.abi).at(dtwitterContract.address)

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

const getMessage = (dtwitterContractInstance, messageId, userAddress) => {
    return new Promise(function(resolve, rejest) {
        dtwitterContractInstance.getMessage(messageId, {from: userAddress}, (err, message) => {
            resolve(message)
        })
    })
}

const getMessages = (dtwitterContractInstance, userAddress, friendAddress) => {
    return new Promise(function(resolve, reject) {
        dtwitterContractInstance.getMessages({from: userAddress}, (err, messageIds) => {
            resolve(messageIds)
        })
    })
}

const sendMessage = (dtwitterContractInstance, userAddress, message) => {
    return new Promise(function(resolve, reject) {
        dtwitterContractInstance.sendMessage.sendTransaction(
            message,
            {from: userAddress},
            (err, result) => { resolve(result) }
        )
    })
}

const messageComparer = (m1, m2) => {
    if (m1.When > m2.When) {
        return -1;
    } else if (m1.When < m2.When) {
        return 1;
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
