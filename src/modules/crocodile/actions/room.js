export const UPDATE_ROOM = 'UPDATE_ROOM';
export function update(room) {
    return {
        type: UPDATE_ROOM,
        payload: room,
    };
}