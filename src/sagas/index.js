import getWeb3 from '../helpers/getWeb3'
import { takeEvery, takeLatest, take, select, fork, call, put, all } from 'redux-saga/effects'

import * as actionTypes from '../constants/actionTypes'
import { dtwitterContract } from '../contracts'
import store from '../store'

// デバッグ用. すべてのアクションとキャッチする.
function* watchAndLog() {
  while (true) {
    const action = yield take('*')
    const state = yield select()
    console.log('action', action)
  }
}

function* fetchWeb3ConnectionAsync() {
    yield take(actionTypes.FETCH_WEB3_CONNECTION_REQUESTED)
    const { web3 } = yield getWeb3
    const accounts = yield getAccounts
    const instance = web3.eth.contract(dtwitterContract.abi).at(dtwitterContract.address)

    instance.MessageSent()
    .watch((err, result) => {
        console.log("Message mined!")
    })

    yield put({
        type: actionTypes.FETCH_WEB3_CONNECTION_SUCCESS,
        web3: web3,
        userAddress: accounts[0],
        contractInstance: instance
    })
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
    yield fork(fetchWeb3ConnectionAsync)
    yield fork(watchAndLog)
}
