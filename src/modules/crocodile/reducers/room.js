import { UPDATE_ROOM } from "../actions/room";

let initialState = null;

export default function room(state = initialState, action) {

    let newState;

    switch(action.type) {

        case UPDATE_ROOM:
            newState = JSON.parse(JSON.stringify(state));
            let room = action.payload;
            newState = room;
            return newState;

        default:
            return state;

    }

}