import React from "react";
import { UPDATE_CASCADE, ADD, DELETE } from "../actionTypes";
import { F } from '../../';
import { DEFAULT_CONTENT } from '../../constants';

const cascade = (state = {}, action) => {
    let cloneState = {...state};
    switch (action.type) {
        case ADD: {
            const { idFuck, index, type } = action.payload;
            let current = cloneState[idFuck];
            if(type === current.type) {
                let currentContent = current.data[index].content;
                let currentElement = current.data[index].element;
                current.data.splice(index, 0, {
                    content: 'DEFAULT',
                    element: React.createRef()
                });
                current.data[index+1].content = currentContent;
                current.data[index+1].element = currentElement;
                current.data = F.getDefaultSize(idFuck, current.data);
            } else {
                let currentContent = current.data[index].content;
                let grid = [
                    {
                        content: DEFAULT_CONTENT,
                        element: React.createRef(),
                    },
                    {
                        content: currentContent,
                        element: React.createRef(),
                    },
                ];
                delete current.data[index].content;
                current.data[index].grid = grid;
                current.data[index].type = type;
                current.data = F.refresh(current.data);
            }
            return cloneState;
        }
        case DELETE: {
            const { idFuck, parentId, grandParentId } = action.payload;
            let { length } = cloneState[parentId].data;
            const defaultDeleteF = () => {
                cloneState[parentId].data = F.getDefaultSize(
                        parentId,
                        cloneState[parentId].data.filter(item => item.idFuck !== idFuck
                    )
                );
                if(grandParentId) {
                    if(cloneState[grandParentId].data[0].grid) {
                        cloneState[grandParentId].data[0].grid = cloneState[parentId].data.map(item => ({ content: item.content }))
                    }
                }
            };
            if(length > 2) {
                defaultDeleteF();
            } else if (length === 2) {
                let lastItem = cloneState[parentId].data.find(item => item.idFuck !== idFuck);
                if(grandParentId && cloneState[grandParentId]) {
                    let targetItem = cloneState[grandParentId].data.find(item => item.idFuck === parentId);
                    let targetItemIndex = cloneState[grandParentId].data.findIndex(item => (item.idFuck === parentId));
                    if(lastItem.grid && !lastItem.content) {
                        let id = lastItem.idFuck;
                        let dataRoot = cloneState[id].data;
                        let dataToBeAddedIntoTargetItem = dataRoot.map(item => ({
                            content: item.content,
                            grid: item.grid
                        }));
                        cloneState[grandParentId].data.splice(targetItemIndex, 1, ...dataToBeAddedIntoTargetItem);
                        cloneState[grandParentId].data = F.getDefaultSize(grandParentId, cloneState[grandParentId].data);
                        delete cloneState[id];
                    } else {
                        delete targetItem.grid;
                        targetItem.content = lastItem.content;
                    }
                    delete cloneState[parentId];
                } else {
                    defaultDeleteF();
                }
            }
            return cloneState;
        }
        case UPDATE_CASCADE: {
            const { data, type, idFuck, parentId } = action.payload;
            cloneState[idFuck] = {
                type,
                data,
                parentId
            };
            return cloneState;
        }
        default: {
            return state;
        }
    }
};

export default cascade;
