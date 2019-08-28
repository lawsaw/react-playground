import React, { useReducer, useEffect } from 'react';
import { cloneDeep, isEqual } from 'lodash';
import { findFirst, findAndDeleteFirst } from '../../helpers/etc';

const initialStore = {
    idFuck: 'root',
    type: 'row',
    grid: [
        {
            content: 132132,
        },
        {
            content: 978978,
        },
        {
            content: 11325646,
        },
    ]
};

let rootStore = {
    idFuck: 'root',
    type: 'row',
    grid: [
        {
            content: 5455,
        },
        {
            content: 11,
            // type: 'col',
            // grid: [
            //     {
            //         content: 34,
            //     },
            //     {
            //         content: 4325,
            //     },
            //     {
            //         content: 24,
            //     },
            // ]
        },
        {
            content: 4112,
        },
    ]
};

// function isObjInArray(obj, arr) {
//     return arr.some(function(elem) {
//         return (elem.idFuck === obj.idFuck)
//     })
// }
//
// function smartMerge(arr1, arr2) {
//     let merged = [...arr1, ...arr2];
//     let uniqueArray = [];
//     merged.forEach((item, pos, self) => {
//         if(!isObjInArray(item, uniqueArray)) {
//             uniqueArray.push(item);
//         }
//     });
//     return uniqueArray.reverse().filter(item => item.idFuck);
// }

function smartMerge(arr1, arr2) {
    let data = cloneDeep(arr2);
    data.forEach((item, index, arr) => {
        if(data[index].grid && arr1[index].grid) {
            data[index].grid = arr1[index].grid;
        }
        //return item;
        //item.grid = arr2[index].grid ? arr2[index].grid : item.grid
    })
    return data;
}

const setStore = (props) => {
    //let clonedStore = cloneDeep(rootStore);
    let current;
    let { action, data, type, id, parentId, gridItemId } = props;
    console.log(action, data, type, id, parentId, gridItemId);
    switch (action) {
        case "update":
            current = findFirst(rootStore, 'grid', { idFuck: id });
            //let parent = findFirst(clonedStore, 'grid', { idFuck: parentId });
            //current.grid = current.grid ? smartMerge(current.grid, data) : data;

            if(current) {
                current.grid = data;
                current.type = type;
            }

            //current.grid = current.grid ? current.grid : data;
            //rootStore = clonedStore;
            //return current.grid;
            break;
        case "delete":
            let clonedStoreAfterDeletion = findAndDeleteFirst(rootStore, 'grid', { idFuck: id });
            //rootStore = clonedStoreAfterDeletion;
            //console.log(rootStore);
            break;
        default:
            return 0;
            break;
    }
};

const reducer = (store, action) => {
    let { type, data, id, parentId, gridItemId } = action;
    let current = findFirst(store, 'grid', { idFuck: id });
    switch (type) {
        case "get":
            return current.grid;
            break;
        case "set":
            console.log(data);
            current.grid = current.grid ? smartMerge(current.grid, data) : data;
            return { ...store };
            break;
        default:
            return { ...store };
            break;
    }
};


// const reducer = (store, action) => {
//     let clonedStore = cloneDeep(store);
//     console.log(clonedStore);
//     let find = findFirst(clonedStore, 'grid', { idFuck: action.id });
//     switch (action.type) {
//         case "test":
//             console.log('test ' + action.type + ' ' + action.pizda);
//             return { ...store, count: store.count - 1 };
//             break;
//         case "init":
//             console.log(find);
//             console.log(action);
//             find.grid = action.grid;
//             //find.type = action.gridType;
//             return { ...clonedStore };
//             break;
//         case "update":
//             console.log(find);
//             console.log(action);
//             find.grid = action.grid;
//             return { ...clonedStore };
//             break;
//         case "split":
//             console.log(store);
//             console.log(action);
//             console.log(find);
//             console.log(action.grid[action.ids].content);
//             find.grid = action.grid[action.ids].grid;
//             find.content = action.grid[action.ids].content;
//             find.loaded = true;
//             // let find2 = findFirst(clonedStore, 'grid', { idFuck: action.id });
//             // console.log(find2);
//             // console.log(action.grid);
//             return { ...clonedStore };
//             break;
//         default:
//             return { ...store };
//             break;
//     }
// };

const StoreContext = React.createContext(initialStore);

function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(reducer, initialStore);

    function uploadVisitorDetails() {}

    useEffect(
        () => {
            if (store.savingVisitor) {
                uploadVisitorDetails();
            }
        },
        [store.savingVisitor]
    );

    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

export { StoreContext, StoreProvider, initialStore, rootStore, setStore };
