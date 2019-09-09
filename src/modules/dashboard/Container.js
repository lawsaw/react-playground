import React, { isValidElement, createContext, useContext, useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Grid } from './';
import { clone, cloneDeep, cloneDeepWith } from "lodash";
import { StoreProvider, StoreContext, initialStore, rootStore } from "./";
import { findFirst } from '../../helpers/etc';
//import { initData } from './constants';

export const initData = {
    idFuck: 'root',
    type: 'row',
    grid: [
        {
            content: 'FUCK',
        },
        {
            content: 54855,
        },
        {
            //content: 11,
            type: 'col',
            grid: [
                {
                    content: 34,
                },
                {
                    //content: 4325,
                    type: 'row',
                    grid: [
                        {
                            content: 1,
                        },
                        {
                            content: 2,
                        }
                    ]
                },
                {
                    content: 24,
                },
            ]
        },
        {
            content: 4112,
        },
    ]
}

const styles = (theme) => ({
    dashboard: {
        position: 'relative',
        width: 600,
        height: 600,
        backgroundColor: lighten(theme.palette.grey[500], 0.8),
    },
});

const LIMIT_ABSOLUTE = 15;
const LIMIT_RELATIVE = 50;
const initialContent = 'DEFAULT';

export default withStyles(styles)(({ classes }) => {

    // useEffect(() => {
    //     init();
    // }, []);

    // function init() {
    //     let data = getDefaultSize(initialStore.store);
    //     dispatch({type: 'firstInit', data});
    // }

    function getUpdatedData(id, type, distance, srcData, realSize) {
        let cloneData = cloneDeepWith(srcData, value => {if(value && isValidElement(value)) return value});
        //let cloneData = clone(srcData);
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
    }

    function getRealSize(id, data) {
        let elementPrev = data[id].element.current;
        let elementNext = data[id+1].element.current;
        let { width: widthRealPrev, height:heightRealPrev } = elementPrev.getBoundingClientRect();
        let { width: widthRealNext, height:heightRealNext } = elementNext.getBoundingClientRect();
        return { widthRealPrev, heightRealPrev, widthRealNext, heightRealNext };
    }

    function getItemSizeAccordingToType({size, space}, type) {
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
    }

    function getRandomContent() {
        let data = [
            'Пизда',
            'Демо контент',
            'Ой нимагу',
            'ЯПлакаль',
            'Шо поделать',
        ];
        let index = Math.floor(Math.random() * data.length);
        return data[index];
    }

    function generateId() {
        return Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
    }

    function getDefaultSize(id, dataSrc) {
        let sizeDefault = 100 / dataSrc.length;
        //let { isInited } = dataSrc;
        return dataSrc.map(({ idFuck, element, size, space, ...props }, index) => {
            let etc = {};
            // if(grid && grid.length) {
            //     etc.grid = isInited ? grid : getDefaultSize(grid);
            //     etc.content = renderGrid({idFuck, grid: etc.grid, type: props.type});
            //     //console.log({idFuck, grid: etc.grid, type: props.type});
            // } else {
            //     etc.content = content;
            // }
            //*etc.content = content;
            return {
                ...props,
                idFuck: idFuck || `${id}_${generateId()}`,
                size: sizeDefault,
                space: sizeDefault * index,
                element: element || React.createRef(),
                parentId: id,
                //...etc,
            }
        });
    }

    function getGrid(id) {
        return findFirst(rootStore, 'grid', { idFuck: id }).grid;
    }

    function getSeparatorOptions(type) {
        return type === 'col' ? {
            clientDirection: 'clientX',
            cursor: 'col-resize',
        } : {
            clientDirection: 'clientY',
            cursor: 'row-resize',
        };
    }

    // function getDataWithNewSection(id, newType, type, srcData, callback=null) {
    //     let newData = [...srcData];
    //     let currentContent = newData[id].content;
    //     let currentElement = newData[id].element;
    //     if(newType === type) {
    //         newData.splice(id, 0, {content: initialContent, element: React.createRef()});
    //         newData[id+1].content = currentContent;
    //         newData[id+1].element = currentElement;
    //         newData = getDefaultSize(newData.length, newData);
    //     } else {
    //         let nData = [
    //             {content: initialContent, element: React.createRef()},
    //             {content: currentContent, element: React.createRef()},
    //         ];
    //         newData[id].content = renderGrid({type:newType, initialData:nData, updateParentData:callback});
    //     }
    //     return newData;
    // }

    function sectionAdd(id, srcData) {
        let newData = [...srcData];
        let currentContent = srcData[id].content;
        let currentElement = srcData[id].element;
        //let currentGrid = srcData[id+1].grid;
        newData.splice(id, 0, {
            content: initialContent,
            element: React.createRef()
        });
        newData[id+1].content = currentContent;
        newData[id+1].element = currentElement;
        // if(currentGrid) {
        //     newData[id+1].grid = currentGrid;
        // }
        newData = getDefaultSize(newData);
        // console.log(id);
        // console.log(srcData[id].grid);
        // console.log(srcData);
        // console.log(newData);
        return newData;
    }

    function sectionSplit(id, idUnic, srcData, newType) {
        let newData = [...srcData];
        let currentContent = newData[id].content;
        let idNew = generateId();
        let idCurrent = generateId();
        let nData = [
            {
                idFuck: idNew,
                content: initialContent,
                element: React.createRef()
            },
            {
                idFuck: idCurrent,
                content: currentContent,
                element: React.createRef()
            },
        ];
        newData[id].grid = nData;
        newData[id].type = newType;
        newData[id].content = renderGrid({idFuck: idUnic, grid: nData, type: newType});
        return newData;
    }

    // function createGrid(srcData, newType, nData, id) {
    //     srcData[id].content = renderGrid({type: newType, grid: nData, id});
    // }

    function renderGrid(props) {
        return (
            <Grid
                {...props}
                getRealSize={getRealSize}
                getUpdatedData={getUpdatedData}
                getItemSizeAccordingToType={getItemSizeAccordingToType}
                getDefaultSize={getDefaultSize}
                getSeparatorOptions={getSeparatorOptions}
                prepareData={prepareData}
                sectionAdd={sectionAdd}
                sectionSplit={sectionSplit}
                renderGrid={renderGrid}
                generateId={generateId}
                getGrid={getGrid}
            />
        )
    }

    function prepareData(src) {
        return getDefaultSize(src);
    }



    return (
        <Box
            className={classes.dashboard}
        >
            <StoreProvider>
                {
                    renderGrid({...initData})
                }
            </StoreProvider>
        </Box>
    );
});