import React, { isValidElement } from "react";
import { cloneDeepWith } from "lodash";
import { LIMIT_ABSOLUTE, LIMIT_RELATIVE } from './constants';

const generateId = () => Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);

const refresh = (data) => data.map(({ ...props }) => ({...props}));

const getDefaultSize = (id, data) => {
    let sizeDefault = 100 / data.length;
    return data.map(({ idCurrent, element, size, space, idParent, ...props }, index) => {
        return {
            ...props,
            idCurrent: idCurrent || `${id}_${generateId()}`,
            size: sizeDefault,
            space: sizeDefault * index,
            element: element || React.createRef(),
            idParent: idParent || id,
        }
    });
};

const getUpdatedData = (id, type, distance, data, realSize) => {
    let cloneData = cloneDeepWith(data, value => {if(value && isValidElement(value)) return value});
    let { size: sizePrev, space:spacePrev } = cloneData[id];
    let { size: sizeNext, space:spaceNext } = cloneData[id+1];
    let { widthPrev, heightPrev, widthNext, heightNext } = realSize;
    let max, size, delta, currentLimit, value = Math.abs(distance);
    if(distance < 0) {
        max = type === 'col' ? widthPrev : heightPrev;
        value = max - value < LIMIT_RELATIVE ? max - LIMIT_RELATIVE : value;
        delta = value * sizePrev / max;
        currentLimit = sizePrev - LIMIT_ABSOLUTE;
        delta = delta > currentLimit ? currentLimit : delta;
        size = sizePrev - delta;
        cloneData[id].size = size;
        cloneData[id+1].size = sizeNext + delta;
        cloneData[id+1].space = spacePrev + size;
    } else {
        max = type === 'col' ? widthNext : heightNext;
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

const getRealSize = (index, data) => {
    let prev = data[index].element.current;
    let next = data[index+1].element.current;
    let { width: widthPrev, height:heightPrev } = prev.getBoundingClientRect();
    let { width: widthNext, height:heightNext } = next.getBoundingClientRect();
    return { widthPrev, heightPrev, widthNext, heightNext };
};

const getSeparatorOptions = (type) => type === 'col' ? {
        clientDirection: 'clientX',
        cursor: 'col-resize',
    } : {
        clientDirection: 'clientY',
        cursor: 'row-resize',
    };

const getItemSizeAccordingToType = ({size, space}, type) => type === 'col' ? {
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


export default {
    getDefaultSize,
    generateId,
    refresh,
    getUpdatedData,
    getRealSize,
    getSeparatorOptions,
    getItemSizeAccordingToType,
};