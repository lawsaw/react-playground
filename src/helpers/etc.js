import { isEqual } from 'lodash';

export const findFirst = (tree, childrenKey, objToFindBy) => {
    let treeToReturn = tree;
    let found = false;
    const findKeys = Object.keys(objToFindBy);
    findKeys.forEach((key) => {
        isEqual(tree[key], objToFindBy[key]) ? found = true : found = false;
    });
    if (found) {
        return tree;
    }
    const findInChildren = (obj, childrenKey, objToFindBy) => {
        let foundInChild = false;
        if (obj.hasOwnProperty(childrenKey)) {
            for (let i = 0; i < obj[childrenKey].length; i++) {
                findKeys.forEach((key) => {
                    isEqual(obj[childrenKey][i][key], objToFindBy[key]) ? foundInChild = true : foundInChild = false;
                });
                if (foundInChild) {
                    found = true;
                    treeToReturn = obj[childrenKey][i];
                    break;
                }
            }
            if (!foundInChild && !found) {
                obj[childrenKey].forEach(child => findInChildren(child, childrenKey, objToFindBy));
            }
        }
        return obj;
    };
    findInChildren(tree, childrenKey, objToFindBy);
    return found ? treeToReturn : false;
};

export const findAndModifyFirst = (tree, childrenKey, objToFindBy, replacementObj) => {
    let treeToReturn = tree;
    let findSuccess = false;
    let modifiedObj = false;
    const findKeys = Object.keys(objToFindBy);
    findKeys.forEach((key) => {
        isEqual(tree[key], objToFindBy[key]) ? findSuccess = true : findSuccess = false;
    });
    if (findSuccess) {
        for (let prop in tree) {
            delete tree[prop];
        }
        for (let prop in replacementObj) {
            tree[prop] = replacementObj[prop];
        }
        return tree;
    }
    const findInChildren = (obj, childrenKey, objToFindBy, replacementObj) => {
        if (obj.hasOwnProperty(childrenKey)) {
            for (let i = 0; i < obj[childrenKey].length; i++) {
                findKeys.forEach((key) => {
                    isEqual(obj[childrenKey][i][key], objToFindBy[key]) ? findSuccess = true : findSuccess = false;
                });
                if (findSuccess) {
                    obj[childrenKey][i] = replacementObj;
                    modifiedObj = true;
                    break;
                }
            }
            if (!findSuccess) {
                obj[childrenKey].forEach(child => findInChildren(child, childrenKey, objToFindBy, replacementObj));
            }
        }
        return obj;
    };
    findInChildren(tree, childrenKey, objToFindBy, replacementObj);
    return modifiedObj ? treeToReturn : false;
};

export const findAndDeleteFirst = (tree, childrenKey, objToFindBy) => {
    let treeToReturn = tree;
    let modifiedObj = false;
    const findInChildren = (obj, childrenKey, objToFindBy) => {
        const findKeys = Object.keys(objToFindBy);
        let findSuccess = false;
        if (obj.hasOwnProperty(childrenKey)) {
            for (let i = 0; i < obj[childrenKey].length; i++) {
                findKeys.forEach((key) => {
                    isEqual(obj[childrenKey][i][key], objToFindBy[key]) ? findSuccess = true : findSuccess = false;
                });
                if (findSuccess) {
                    obj[childrenKey].splice(i, 1);
                    modifiedObj = true;
                    break;
                }
            }
            if (!findSuccess) {
                obj[childrenKey].forEach(child => findInChildren(child, childrenKey, objToFindBy));
            }
        }
        return obj;
    };
    findInChildren(tree, childrenKey, objToFindBy);
    return modifiedObj ? treeToReturn : false;
};