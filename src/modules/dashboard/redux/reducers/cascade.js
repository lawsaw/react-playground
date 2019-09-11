import React from "react";
import { UPDATE, ADD, DELETE } from "../actionTypes";
import { F } from '../../';
import { DEFAULT_CONTENT } from '../../constants';

const cascade = (state = {}, action) => {
    let cloneState = {...state};
    switch (action.type) {
        case ADD: {
            const { idCurrent, index, type } = action.payload;
            let current = cloneState[idCurrent];
            if(type === current.type) {
                let currentContent = current.data[index].content;
                let currentElement = current.data[index].element;
                current.data.splice(index, 0, {
                    content: 'DEFAULT',
                    element: React.createRef()
                });
                current.data[index+1].content = currentContent;
                current.data[index+1].element = currentElement;
                current.data = F.getDefaultSize(idCurrent, current.data);
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
            const { idCurrent, idParent, idGrandParent } = action.payload;
            let { length } = cloneState[idParent].data;
            const defaultDeleteF = () => {
                cloneState[idParent].data = F.getDefaultSize(
                        idParent,
                        cloneState[idParent].data.filter(item => item.idCurrent !== idCurrent
                    )
                );
                if(idGrandParent) {
                    if(cloneState[idGrandParent].data[0].grid) {
                        cloneState[idGrandParent].data[0].grid = cloneState[idParent].data.map(item => ({ content: item.content }))
                    }
                }
            };
            if(length > 2) {
                defaultDeleteF();
            } else if (length === 2) {
                let lastItem = cloneState[idParent].data.find(item => item.idCurrent !== idCurrent);
                if(idGrandParent && cloneState[idGrandParent]) {
                    let targetItem = cloneState[idGrandParent].data.find(item => item.idCurrent === idParent);
                    let targetItemIndex = cloneState[idGrandParent].data.findIndex(item => (item.idCurrent === idParent));
                    if(lastItem.grid && !lastItem.content) {
                        let id = lastItem.idCurrent;
                        let dataRoot = cloneState[id].data;
                        let dataToBeAddedIntoTargetItem = dataRoot.map(item => ({
                            content: item.content,
                            grid: item.grid
                        }));
                        cloneState[idGrandParent].data.splice(targetItemIndex, 1, ...dataToBeAddedIntoTargetItem);
                        cloneState[idGrandParent].data = F.getDefaultSize(idGrandParent, cloneState[idGrandParent].data);
                        delete cloneState[id];
                    } else {
                        delete targetItem.grid;
                        targetItem.content = lastItem.content;
                    }
                    delete cloneState[idParent];
                } else {
                    defaultDeleteF();
                }
            }
            return cloneState;
        }
        case UPDATE: {
            const { data, type, idCurrent, idParent } = action.payload;
            cloneState[idCurrent] = {
                type,
                data,
                idParent
            };
            return cloneState;
        }
        default: {
            return state;
        }
    }
};

export default cascade;
