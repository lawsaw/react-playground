import { UPDATE_CASCADE, ADD, DELETE } from "./actionTypes";

export const updateCascade = ({data, type, idFuck, parentId, gridItemId}) => ({
    type: UPDATE_CASCADE,
    payload: { data, type, idFuck, parentId, gridItemId }
});

export const add = ({idFuck, idChild, index, parentId, type}) => ({
    type: ADD,
    payload: { idFuck, idChild, index, parentId, type }
});

export const del = ({index, idFuck, parentId, grandParentId}) => ({
    type: DELETE,
    payload: { index, idFuck, parentId, grandParentId }
});
