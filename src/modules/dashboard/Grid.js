import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import { isElement } from 'react-dom/test-utils';
import Box from '@material-ui/core/Box';
import {GridItem, Grid, setStore, rootStore} from './';
import { clone, cloneDeep } from 'lodash';
import { StoreContext } from "./";
import { findFirst, findAndDeleteFirst } from '../../helpers/etc';

const styles = () => ({
    grid: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
});

export default withStyles(styles)(({
        propData,
        classes,
        getUpdatedData,
        getRealSize,
        getItemSizeAccordingToType,
        getDefaultSize,
        getSeparatorOptions,
        getDataWithNewSection,
        updateParentData,
        prepareData,
        sectionAdd,
        sectionSplit,
        renderGrid,
        getGrid,
        level,
        grid,
        idFuck,
        //type,
        //grid,
        parentId,
        gridItemId,

        ...props
    }) => {

    //let grid = findFirst(rootStore, 'grid', { idFuck }).grid || props.grid;

    let inited = false;

    //const { store, dispatch } = useContext(StoreContext);

    //let grid = dispatch({type: 'get', id: idFuck});

    const [data, setData] = useState(getDefaultSize(grid));
    const [type, setType] = useState(props.type);

    setStore({action: 'update', data, type, id: idFuck, parentId, gridItemId});

    //let data = getGrid(store, idFuck) || null;

    // useEffect(() => {
    //     if(!inited) {
    //         dispatch({type: 'set', data: getDefaultSize(grid), id: idFuck});
    //         console.log(data);
    //         console.log(store);
    //         inited = true;
    //     }
    // }, []);

    useEffect(() => {
        //setStore({action: 'update', data, id: idFuck, parentId, gridItemId});
        //console.log('update ' + idFuck);
    }, []);



    let tempDataSize = null;
    let realSize = {};
    let start = 0;
    let finish = 0;
    let onMouseUpEvent = null;
    let onMouseMoveEvent = null;
    let savedChildData = null;

    function update(id, data) {
        //dispatch({type: 'set', data, id, parentId, gridItemId});
        //let currentData = getGrid(id);
        console.log(data);
        setData(data);
    }

    function del(id, data) {

    }

    function addSection(ids, idUnic, newType) {
        let newData;
        //let current = findFirst(rootStore, 'grid', { idFuck }).grid;
        let current = data;

        if(newType === type) {
            newData = sectionAdd(ids, current);
            console.log('newType === type');
            console.log(current);
            console.log(newData);
            update(idFuck, newData);
        } else if(newType !== type) {
            if(current.length === 1) {
                console.log('ACTION');
                setType(newType);
                newData = sectionAdd(ids, current);
                update(idFuck, newData);
            } else {
                console.log('ELSE');
                newData = sectionSplit(ids, idUnic, idFuck, data, newType);
                update(idFuck, newData);
            }
        }

    }


    function deleteSection(ids, id) {
        if(idFuck === 'root' && data.length === 1) {
            console.log(`idFuck: ${idFuck}; id: ${id}; index: ${ids}; type 1; length: ${data.length}`);
            return false;
        }
        else if(data.length > 2) {
            let cloneData = [...data];
            cloneData.splice(ids, 1);
            update(id, getDefaultSize(cloneData));
            console.log(`idFuck: ${idFuck}; id: ${id}; index: ${ids}; type 2; length: ${data.length}`);
            return false;
        } else if(data.length === 2) {
            let cloneData = [...data];
            cloneData.splice(ids, 1);
            if(cloneData[0].grid && cloneData[0].grid.length > 0) {
                let lastData = [...cloneData[0].grid];
                setType(cloneData[0].type);
                update(id, getDefaultSize(lastData));
            } else {
                console.log('ELSE');
                console.log(`idFuck: ${idFuck}; id: ${id}; index: ${ids}; type 3; length: ${data.length}`);
                console.log(cloneData);
                console.log(rootStore);
            }
        } else {
            console.log(`idFuck: ${idFuck}; id: ${id}; index: ${ids}; type ELSE; length: ${data.length}`);
            return false;
        }
    }

    function updateData(ids, distance) {
        let nData = getUpdatedData(ids, type, distance, data, realSize);
        if(tempDataSize !== nData[ids].size) {
            tempDataSize = nData[ids].size;
            update(idFuck, nData);
        }
    }

    function handleOnMouseDown(e, id) {
        let { clientDirection } = getSeparatorOptions(type);
        start = e[clientDirection];
        realSize = getRealSize(id, data);
        onMouseUpEvent = e => handleOnMouseUp(e, id);
        onMouseMoveEvent = e => handleOnMouseMove(e, id);
        document.addEventListener('mouseup', onMouseUpEvent, false);
        document.addEventListener('mousemove', onMouseMoveEvent, false);
    }

    function handleOnMouseMove(e, id) {
        let { clientDirection } = getSeparatorOptions(type);
        finish = e[clientDirection];
        let distance = finish - start;
        updateData(id, distance);
    }

    function handleOnMouseUp(e, id) {
        let { clientDirection } = getSeparatorOptions(type);
        finish = e[clientDirection];
        document.removeEventListener('mouseup', onMouseUpEvent, false);
        document.removeEventListener('mousemove', onMouseMoveEvent, false);
    }
    console.log({idFuck, data, rootStore});

    function returnContent(contentArray) {
        return contentArray.map((item, index) => {
            let { gridItem: style, separator: styleSeparator } = getItemSizeAccordingToType(item, type);
            return (
                <GridItem
                    key={index}
                    id={index}
                    idUnic={item.idFuck}
                    currentData={contentArray}
                    isLast={contentArray[index+1]}
                    style={style}
                    styleSeparator={styleSeparator}
                    addSection={addSection}
                    deleteSection={deleteSection}
                    optionsSeparator={getSeparatorOptions(type)}
                    handleOnMouseDown={handleOnMouseDown}
                    content={item.content}
                    element={item.element}
                />
            )
        })
    }

    return (
        <Box
            className={classes.grid}
        >
            {
                //grid && grid[0].size ? returnContent(grid) : data && data[0].size ? returnContent(data) : 'No Data'
                data ? returnContent(data) : 'No Data LOL'
            }

        </Box>
    );
});