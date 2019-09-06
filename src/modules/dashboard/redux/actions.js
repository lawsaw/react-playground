import { ADD_TODO, TOGGLE_TODO, SET_FILTER, UPDATE_CASCADE } from "./actionTypes";

let nextTodoId = 0;

export const addTodo = content => ({
    type: ADD_TODO,
    payload: {
        id: ++nextTodoId,
        content
    }
});

export const toggleTodo = id => ({
    type: TOGGLE_TODO,
    payload: { id }
});

export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });

export const updateCascade = ({data, type, id, parentId, gridItemId}) => ({
    type: UPDATE_CASCADE,
    payload: { data, type, id, parentId, gridItemId }
});

export const getTest = () => ({ type: 'TEST', payload: {} });
