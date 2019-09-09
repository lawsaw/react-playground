import { cloneDeep, isEqual } from 'lodash';
import { SET_FILTER, UPDATE_CASCADE, ADD, DELETE } from "../actionTypes";
import { findFirst } from "../../../../helpers/etc";
import { initData } from '../../constants';
import { F } from '../../';
import React from "react";

const initialState = {};

const cascade = (state = initialState, action) => {
    let cloneState = {...state};
    switch (action.type) {
        case SET_FILTER: {
            return action.payload.filter;
        }
        case ADD: {
            const { idFuck, idChild, index, parentId, type } = action.payload;
            let current = cloneState[idFuck];
            console.log(idFuck, idChild, index, parentId, type);
            if(type === current.type) {
                console.log('type is the same');
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
                console.log('type is NOT the same');
                let currentContent = current.data[index].content;
                let grid = [
                    {
                        //idFuck: F.generateId(),
                        content: 'FUCKED',
                        element: React.createRef(),
                    },
                    {
                        //idFuck: F.generateId(),
                        content: currentContent,
                        element: React.createRef(),
                    },
                ];
                delete current.data[index].content;
                current.data[index].grid = grid;
                current.data[index].type = type;
                current.data = F.refresh(current.data);
                //current.data = F.getDefaultSize(idFuck, current.data);
            }
            console.log(cloneState);
            //console.log(current);
            return cloneState;
        }
        case DELETE: {
            const { idFuck, parentId, index } = action.payload;
            let { length } = cloneState[parentId].data;
            console.log(idFuck, parentId, index);
            if(length > 2) {
                cloneState[parentId].data = F.getDefaultSize(
                    parentId,
                    cloneState[parentId].data.filter(item => item.idFuck !== idFuck
                    )
                );
                console.log(length + ' is case 1');
            } else if (length === 2) {
                let left = cloneState[parentId].data.find(item => item.idFuck !== idFuck);
                let leftId = left.idFuck;
                cloneState[parentId].data = [...cloneState[leftId].data];
                cloneState[parentId].type = cloneState[leftId].type;
                delete cloneState[leftId];
                console.log(length + ' is 2');
                console.log(left);
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

            // let current = findFirst(cloneState, 'grid', { idFuck: id });
            // if(current) {
            //     current.grid = data;
            //     current.type = type;
            //     console.log({id, cloneState, action: action.payload});
            // }
            //console.log(cloneState);

            return cloneState;
        }
        case 'TEST':
            return 555;
        default: {
            return state;
        }
    }
};

export default cascade;
