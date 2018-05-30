import { combineReducers } from 'redux'
import { fromJS } from 'immutable'

import { SET_HISTORY, SET_FRIEND_ADDRESS, SET_USER_ADDRESS, SET_WEB3, SET_CONTRACT_INSTANCE } from '../constants';

const INITIAL_STATE = {
    userAddress: "0x0",
    friendAddress: "0x0",
    history: [],
    web3: null,
    contractInstance: null,
}

export default function dmsgReducer(state = INITIAL_STATE, action = {})
{
    switch (action.type)
    {
        case SET_HISTORY:
            return Object.assign({}, state, {
                history: action.payload
            })
        case SET_USER_ADDRESS:
            return Object.assign({}, state, {
                userAddress: action.payload
            })
        case SET_FRIEND_ADDRESS:
            return Object.assign({}, state, {
                friendAddress: action.payload
            })
        case SET_WEB3:
            return Object.assign({}, state, {
                web3: action.paylaod
            })
        case SET_CONTRACT_INSTANCE:
            return Object.assign({}, state, {
                contractInstance: action.paylaod
            })
        default:
            return state
    }
}
