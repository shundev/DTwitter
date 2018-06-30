import { combineReducers } from 'redux'
import { fromJS } from 'immutable'

import * as actionTypes from '../constants/actionTypes';

const INITIAL_STATE = {
    userAddress: "0x0",
    history: [],
    web3: null,
    contractInstance: null,
}

export default function dmsgReducer(state = INITIAL_STATE, action = {})
{
    switch (action.type)
    {
        case actionTypes.ADD_MESSAGE:
            return Object.assign({}, state, {
                history: [action.payload].concat(state.history)
            })
        case actionTypes.SET_USER_ADDRESS:
            return Object.assign({}, state, {
                userAddress: action.payload
            })
        case actionTypes.FETCH_WEB3_CONNECTION_SUCCESS:
            return Object.assign({}, state, {
                web3: action.web3,
                userAddress: action.userAddress,
                contractInstance: action.contractInstance
            })
        case actionTypes.FETCH_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                history: action.payload
            })
        default:
            return state
    }
}
