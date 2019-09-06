import { cloneDeep, isEqual } from 'lodash';
import { SET_FILTER, UPDATE_CASCADE } from "../actionTypes";
import { findFirst } from "../../../../helpers/etc";
import { initData } from '../../constants';

const initialState = {};

const cascade = (state = initialState, action) => {
    let cloneState = {...state};
    switch (action.type) {
        case SET_FILTER: {
            return action.payload.filter;
        }
        case UPDATE_CASCADE: {
            const { data, type, id } = action.payload;
            let current = findFirst(cloneState, 'grid', { idFuck: id });
            if(current) {
                current.grid = data;
                current.type = type;
                console.log({id, cloneState, action: action.payload});
            }
            //console.log(id, current);
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
