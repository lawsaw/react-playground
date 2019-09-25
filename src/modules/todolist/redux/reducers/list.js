//import React from "react";
import { UPDATE, ADD, DELETE, DONE } from "../actionTypes";
import F from '../../etc';

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
            let { title, description } = action.payload;
            let task = {
                id: F.generateId(),
                title,
                description,
                isDone: false,
            };
            let clone = [...state, task];
            return clone;
        }
        case DELETE: {
            let { id } = action.payload;
            let clone = state.filter(task => task.id !== id);
            return clone;
        }
        case UPDATE: {
            let { id, field, value } = action.payload;
            let clone = [...state];
            let task = clone.find(item => item.id === id);
            task[field] = value;
            console.log(id, field, value);
            return clone;
        }
        case DONE: {
            let { id, status } = action.payload;
            let clone = [...state];
            let task = clone.find(item => item.id === id);
            task.isDone = status;
            return clone;
        }
        default: {
            return state;
        }
    }
};

export default list;
