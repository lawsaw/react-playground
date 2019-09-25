//import React from "react";
import { UPDATE, ADD, DELETE, DONE } from "../actionTypes";

let initialState = [
    {
        id: 'fdsfasdf',
        title: 'Make this',
        description: 'Do it right now',
        isDone: false,
    },{
        id: 'fdsf688afsd',
        title: 'Make this 2',
        description: 'Do it right now 2',
        isDone: true,
    }
]

const list = (state = initialState, action) => {
    switch (action.type) {
        case ADD: {

            return state;
        }
        case DELETE: {

            return state;
        }
        case UPDATE: {
            return state;
        }
        case DONE: {
            return state;
        }
        default: {
            return state;
        }
    }
};

export default list;
