import React from "react";

const generateId = () => {
    return Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
};

const getDefaultSize = (id, dataSrc) => {
    let sizeDefault = 100 / dataSrc.length;
    return dataSrc.map(({ idFuck, element, size, space, parentId, ...props }, index) => {
        return {
            ...props,
            idFuck: idFuck || `${id}_${generateId()}`,
            size: sizeDefault,
            space: sizeDefault * index,
            element: element || React.createRef(),
            parentId: parentId || id,
        }
    });
};

const refresh = (dataSrc) => {
    return dataSrc.map(({ ...props }) => ({...props}));
};

export default {
    getDefaultSize,
    generateId,
    refresh
};