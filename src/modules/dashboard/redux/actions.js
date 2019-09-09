import { ADD_TODO, TOGGLE_TODO, SET_FILTER, UPDATE_CASCADE, ADD, DELETE } from "./actionTypes";

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

export const updateCascade = ({data, type, idFuck, parentId, gridItemId}) => ({
    type: UPDATE_CASCADE,
    payload: { data, type, idFuck, parentId, gridItemId }
});

export const add = ({idFuck, idChild, index, parentId, type}) => ({
    type: ADD,
    payload: { idFuck, idChild, index, parentId, type }
});

export const del = ({index, idFuck, parentId}) => ({
    type: DELETE,
    payload: { index, idFuck, parentId }
});


export const getTest = () => ({ type: 'TEST', payload: {} });
