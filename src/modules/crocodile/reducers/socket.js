import { INIT, STOP } from "../actions/socket";

let initialState = null;

export default function room(state = initialState, action) {

    let newState;

    switch(action.type) {

        case INIT:
            //newState = state;
            //let socket = action.payload;
            newState = action.payload;
            return newState;

        case STOP:
            return newState;

        default:
            return state;

    }

}