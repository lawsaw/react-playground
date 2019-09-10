import React, { isValidElement } from "react";
import { cloneDeepWith } from "lodash";
import { LIMIT_ABSOLUTE, LIMIT_RELATIVE } from './constants';

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

const getUpdatedData = (id, type, distance, srcData, realSize) => {
    let cloneData = cloneDeepWith(srcData, value => {if(value && isValidElement(value)) return value});
    let { size: sizePrev, space:spacePrev } = cloneData[id];
    let { size: sizeNext, space:spaceNext } = cloneData[id+1];
    let { widthRealPrev, heightRealPrev, widthRealNext, heightRealNext } = realSize;
    let max, size, delta, currentLimit, value = Math.abs(distance);
    if(distance < 0) {
        max = type === 'col' ? widthRealPrev : heightRealPrev;
        value = max - value < LIMIT_RELATIVE ? max - LIMIT_RELATIVE : value;
        delta = value * sizePrev / max;
        currentLimit = sizePrev - LIMIT_ABSOLUTE;
        delta = delta > currentLimit ? currentLimit : delta;
        size = sizePrev - delta;
        cloneData[id].size = size;
        cloneData[id+1].size = sizeNext + delta;
        cloneData[id+1].space = spacePrev + size;
    } else {
        max = type === 'col' ? widthRealNext : heightRealNext;
        value = max - value < LIMIT_RELATIVE ? max - LIMIT_RELATIVE : value;
        delta = value * sizeNext / max;
        currentLimit = sizeNext - LIMIT_ABSOLUTE;
        delta = delta > currentLimit ? currentLimit : delta;
        size = sizePrev + delta;
        cloneData[id].size = size;
        cloneData[id+1].size = sizeNext - delta;
        cloneData[id+1].space = spaceNext + delta;
    }
    return cloneData;
};

const getRealSize = (id, data) => {
    let elementPrev = data[id].element.current;
    let elementNext = data[id+1].element.current;
    let { width: widthRealPrev, height:heightRealPrev } = elementPrev.getBoundingClientRect();
    let { width: widthRealNext, height:heightRealNext } = elementNext.getBoundingClientRect();
    return { widthRealPrev, heightRealPrev, widthRealNext, heightRealNext };
};

const getSeparatorOptions = (type) => {
    return type === 'col' ? {
        clientDirection: 'clientX',
        cursor: 'col-resize',
    } : {
        clientDirection: 'clientY',
        cursor: 'row-resize',
    };
};

const getItemSizeAccordingToType = ({size, space}, type) => {
    return type === 'col' ? {
        gridItem: {
            width: `${size}%`,
            height: 'auto',
            left: `${space}%`,
            right: 'auto',
            top: 0,
            bottom: 0,
        },
        separator: {
            width: '10px',
            height: 'auto',
            left: `${size + space}%`,
            right: 'auto',
            top: 0,
            bottom: 0,
        },
    } : {
        gridItem: {
            width: 'auto',
            height: `${size}%`,
            left: 0,
            right: 0,
            top: `${space}%`,
            bottom: 'auto',
        },
        separator: {
            width: 'auto',
            height: '10px',
            left: 0,
            right: 0,
            top: `${size + space}%`,
            bottom: 'auto',
        },
    };
};

export default {
    getDefaultSize,
    generateId,
    refresh,
    getUpdatedData,
    getRealSize,
    getSeparatorOptions,
    getItemSizeAccordingToType,
};