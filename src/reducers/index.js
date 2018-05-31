import { combineReducers } from 'redux'
import { fromJS } from 'immutable'

import { ADD_MESSAGE, SET_FRIEND_ADDRESS, SET_USER_ADDRESS, FETCH_WEB3_CONNECTION_SUCCESS, FETCH_HISTORY_SUCCESS } from '../constants';

const INITIAL_STATE = {
    userAddress: "0x0",
    friendAddress: "0xe31c5b5731f3Cba04f8CF3B1C8Eb6FCbdC66f4B5",
    history: [],
    web3: null,
    contractInstance: null,
}

export default function dmsgReducer(state = INITIAL_STATE, action = {})
{
    switch (action.type)
    {
        case ADD_MESSAGE:
            return Object.assign({}, state, {
                history: state.history.concat(action.payload)
            })
        case SET_USER_ADDRESS:
            return Object.assign({}, state, {
                userAddress: action.payload
            })
        case SET_FRIEND_ADDRESS:
            return Object.assign({}, state, {
                friendAddress: action.payload
            })
        case FETCH_WEB3_CONNECTION_SUCCESS:
            return Object.assign({}, state, {
                web3: action.web3,
                userAddress: action.userAddress,
                contractInstance: action.contractInstance
            })
        case FETCH_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                history: action.payload
            })
        default:
            return state
    }
}
