//export const SOCKET_SERVER = 'http://localhost:3005/';
export const SOCKET_SERVER = 'https://lawsaw-tetris-server.herokuapp.com/';
export const COL_SIZE = 26;
export const ROWS_HIDDEN = 4;
export const ROWS = 20+ROWS_HIDDEN;
export const COLS = 10;
export const SPEED = 500;
export const SPEED_STEP = 10;
export const SPEED_RAISE_FOR_SCORE = 2;
export const POSITION = [0, COLS/2-1];
export const ROTATION_CIRCLE = ['up', 'right', 'down', 'left'];
export const FIGURES = {
    'T': {
        'up': [
            [0,1,0],
            [1,1,1],
        ],
        'down': [
            [1,1,1],
            [0,1,0],
        ],
        'left': [
            [0,1],
            [1,1],
            [0,1],
        ],
        'right': [
            [1,0],
            [1,1],
            [1,0],
        ],
    },
    'Z': {
        'up': [
            [0,1],
            [1,1],
            [1,0],
        ],
        'down': [
            [0,1],
            [1,1],
            [1,0],
        ],
        'left': [
            [1,1,0],
            [0,1,1],
        ],
        'right': [
            [1,1,0],
            [0,1,1],
        ],
    },
    'S': {
        'up': [
            [1,0],
            [1,1],
            [0,1],
        ],
        'down': [
            [1,0],
            [1,1],
            [0,1],
        ],
        'left': [
            [0,1,1],
            [1,1,0],
        ],
        'right': [
            [0,1,1],
            [1,1,0],
        ],
    },
    'Q': {
        'up': [
            [1,1],
            [1,1],
        ],
        'down': [
            [1,1],
            [1,1],
        ],
        'left': [
            [1,1],
            [1,1],
        ],
        'right': [
            [1,1],
            [1,1],
        ],
    },
    'J': {
        'up': [
            [1,1],
            [1,0],
            [1,0],
        ],
        'down': [
            [0,1],
            [0,1],
            [1,1],
        ],
        'left': [
            [1,0,0],
            [1,1,1],
        ],
        'right': [
            [1,1,1],
            [0,0,1],
        ],
    },
    'L': {
        'up': [
            [1,1],
            [0,1],
            [0,1],
        ],
        'down': [
            [1,0],
            [1,0],
            [1,1],
        ],
        'left': [
            [1,1,1],
            [1,0,0],
        ],
        'right': [
            [0,0,1],
            [1,1,1],
        ],
    },
    'I': {
        'up': [
            [1],
            [1],
            [1],
            [1],
        ],
        'down': [
            [1],
            [1],
            [1],
            [1],
        ],
        'left': [
            [1,1,1,1],
        ],
        'right': [
            [1,1,1,1],
        ],
    }
};