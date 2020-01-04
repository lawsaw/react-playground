export const INIT = 'INIT';
export function init(socket) {
    return {
        type: INIT,
        payload: socket,
    };
}

export const STOP = 'STOP';
export function stop() {
    return {
        type: STOP,
    };
}