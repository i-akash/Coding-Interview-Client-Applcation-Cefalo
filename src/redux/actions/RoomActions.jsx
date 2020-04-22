import { ROOM_INFO, NEW_ROOM_INFO } from "../types/Type";

export const getRoomInfoAction = (roomInfo) => ({
  type: ROOM_INFO,
  payload: roomInfo,
});

export const newRoomInfoAction = (roomInfo) => ({
  type: NEW_ROOM_INFO,
  payload: roomInfo,
});
