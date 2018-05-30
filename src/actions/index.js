import { FETCH_HISTORY_REQUESTED, SEND_MESSAGE_REQUESTED, FETCH_WEB3_CONNECTION_REQUESTED, SET_FRIEND_ADDRESS } from '../constants'

export const fetchHistoryRequestAction = () => {
    return { type: FETCH_HISTORY_REQUESTED }
}

export const sendMessageRequestAction = (message) => {
    return { type: SEND_MESSAGE_REQUESTED, payload: message }
}

export const fetchWeb3ConnectionRequestAction = () => {
    return { type: FETCH_WEB3_CONNECTION_REQUESTED }
}

export const setFriendAction = (address) => {
    return { type: SET_FRIEND_ADDRESS, payload: address }
}
