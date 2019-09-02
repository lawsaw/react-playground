import { SET_FILTER, UPDATE_CASCADE } from "../actionTypes";
import { findFirst } from "../../../../helpers/etc";
import { initData } from '../../constants';

const initialState = initData;

const cascade = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTER: {
            return action.payload.filter;
        }
        case UPDATE_CASCADE: {
            const { data, type, id, parentId, gridItemId } = action.payload;
            let current = findFirst(state, 'grid', { idFuck: id });
            if(current) {
                current.grid = data;
                current.type = type;
            }
            console.log(id);
            console.log(state);
            return state;
        }
        default: {
            return state;
        }
    }
};

export default cascade;
