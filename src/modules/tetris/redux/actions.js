import { UPDATE, ADD, DELETE, DONE } from "./actionTypes";

export const update = ({ id, field, value }) => ({
    type: UPDATE,
    payload: { id, field, value }
});

export const done = ({ id, status }) => ({
    type: DONE,
    payload: { id, status }
});

export const add = ({ title, description }) => ({
    type: ADD,
    payload: { title, description }
});

export const del = ({ id }) => ({
    type: DELETE,
    payload: { id }
});
