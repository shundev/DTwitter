import { combineReducers } from 'redux'
import { fromJS } from 'immutable'

import * as actionTypes from '../constants/actionTypes';

// 初期状態に追加するときは以下に追加
const INITIAL_STATE = {
    userAddress: "0x0",
    web3: null,
    contractInstance: null,
}

export default function dmsgReducer(state = INITIAL_STATE, action = {})
{
    switch (action.type)
    {
        case actionTypes.FETCH_WEB3_CONNECTION_SUCCESS:
            return Object.assign({}, state, {
                web3: action.web3,
                userAddress: action.userAddress,
                contractInstance: action.contractInstance
            })
        // アクションの処理は以下に追記
        default:
            return state
    }
}
