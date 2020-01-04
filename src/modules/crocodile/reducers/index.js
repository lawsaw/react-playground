import { combineReducers } from 'redux';

import socket from './socket';
import room from './room';

const mainReducer = combineReducers({
    socket,
    room,
});

export default mainReducer;