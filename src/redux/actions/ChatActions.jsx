import { ALL_MESSAGE, NEW_MESSAGE, REMOVE_ALL_MESSAGE } from "../types/Type";

export const allMessageAction = (messages) => ({
    type: ALL_MESSAGE,
    payload: messages
})


export const newMessageAction = (message) => ({
    type: NEW_MESSAGE,
    payload: message
})


export const removeAllMessageAction = () => ({
    type: REMOVE_ALL_MESSAGE,
    payload: {}
})