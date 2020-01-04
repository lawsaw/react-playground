import { SOCKET_ON_ROOM_LEAVE } from './constants';

export function leaveRoom(socket) {
    socket.emit(SOCKET_ON_ROOM_LEAVE);
}