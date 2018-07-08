import 'babel-polyfill'
import getWeb3 from '../helpers/getWeb3'
import { takeEvery, takeLatest, take, select, fork, call, put, all } from 'redux-saga/effects'

import * as actionTypes from '../constants/actionTypes'
import { dtwitterContract } from '../contracts'
import { store } from '../store'

// デバッグ用. すべてのアクションとキャッチする.
function* watchAndLog() {
  while (true) {
    const action = yield take('*')
    const state = yield select()
    console.log('action', action)
  }
}

function* fetchTimelineAsync() {
    const { contract, userAddress } = yield select()
    const msgIds = yield getMessages(contract, userAddress)
    const getMessageWorkers = []
    for (var i=0; i<msgIds.length; i++) {
        // 0はそれ以上メッセージが無いということ
        if (msgIds[i] == 0) break;
        getMessageWorkers.push(call(getMessage, contract, userAddress, msgId))
    }

    // すべての通信完了を待つ
    const messages = yield all(getMessageWorkers)

    // フォーマットを整える
    const msgObjs = messages.map(msg => {
        return {
            Id: msg[0],
            Who: msg[1],
            What: msg[2],
            When: msg[3]
        }
    })

    // 投稿時間順にソート
    const sorted = msgObjs.sort(messageComparer)

    yield put({ type: actionTypes.FETCH_TIMELINE_SUCCESS, payload: sorted})
}

const getMessages = (contract, userAddress) => {
    return new Promise(function(resolve, reject) {
        contract.getMessages({from: userAddress}, (err, messageIds) => {
            resolve(messageIds)
        })
    })
}

const getMessage = (contract, userAddress, msgId) => {
    return new Promise(function(resolve, reject) {
        contract.getMessage(msgId, {from: userAddress}, (err, msg) => {
            resolve(msg)
        })
    })
}

function* sendMessageAsync(msg) {
    const { contract, userAddress } = yield select()

    // 結果は使わないので捨てる
    yield sendMessage(contract, userAddress, msg)

    // マイニング完了まで表示する仮メッセージ
    const dummyMsg = {
        Id: Math.floor(Math.random() * 100000000),
        Who: userAddress,
        What: msg,
        When: (new Date().valueOf()) / 1000
    }

    yield put({ type: actionTypes.ADD_MESSAGE, payload: dummyMsg})
}

const sendMessage = (contract, userAddress, msg) => {
    return new Promise(function(resolve, reject) {
        contract.sendMessage.sendTransaction(msg, {from: userAddress}, (err, result) => {
            resolve(result)
        })
    })
}

function* fetchWeb3ConnectionAsync() {
    yield take(actionTypes.FETCH_WEB3_CONNECTION_REQUESTED)
    const { web3 } = yield getWeb3
    const accounts = yield getAccounts
    const instance = web3.eth.contract(dtwitterContract.abi).at(dtwitterContract.address)

    instance.MessageSent()
    .watch((err, result) => {
        store.dispatch({ type: actionTypes.FETCH_TIMELINE_REQUESTED })
    })

    yield put({
        type: actionTypes.FETCH_WEB3_CONNECTION_SUCCESS,
        web3: web3,
        userAddress: accounts[0],
        contractInstance: instance
    })

    yield put({ type: actionTypes.FETCH_TIMELINE_REQUESTED })
}

const getAccounts = new Promise(function(resolve, reject) {
    web3.eth.getAccounts((err, result) => resolve(result))
})

// マイニング完了まで表示する仮メッセージ
const dummyMsg = {
    Id: Math.floor(Math.random() * 100000000),
    Who: "user1",
    What: "hello",
    When: (new Date().valueOf()) / 1000
}

// メッセージをソートするルール. 投稿時間が速いほど上に来る.
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
    yield takeEvery(actionTypes.SEND_MESSAGE_REQUESTED, sendMessageAsync)
    yield takeLatest(actionTypes.FETCH_TIMELINE_REQUESTED, fetchTimelineAsync)
    yield fork(fetchWeb3ConnectionAsync)
    yield fork(watchAndLog)
}
