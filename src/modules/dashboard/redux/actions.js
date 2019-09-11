import { UPDATE, ADD, DELETE } from "./actionTypes";

export const update = ({data, type, idCurrent, idParent, gridItemId}) => ({
    type: UPDATE,
    payload: { data, type, idCurrent, idParent, gridItemId }
});

export const add = ({idCurrent, idChild, index, idParent, type}) => ({
    type: ADD,
    payload: { idCurrent, idChild, index, idParent, type }
});

export const del = ({index, idCurrent, idParent, idGrandParent}) => ({
    type: DELETE,
    payload: { index, idCurrent, idParent, idGrandParent }
});
