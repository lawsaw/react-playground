import React, { Component, useState, useEffect, useContext, useReducer } from 'react';
import { withStyles } from '@material-ui/core';
import { isElement } from 'react-dom/test-utils';
import Box from '@material-ui/core/Box';
import {GridItem, Grid as GridComponent, setStore, rootStore} from './';
import { connect } from "react-redux";
import { updateCascade, getTest, add, del } from "./redux/actions";
import { clone, cloneDeep, isEqual } from 'lodash';
import { StoreContext } from "./";
import { findFirst, findAndDeleteFirst } from '../../helpers/etc';
import cascade from "./redux/reducers/cascade";

const styles = () => ({
    grid: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
});

const Grid = withStyles(styles)(({
     propData,
     classes,
     getUpdatedData,
     getRealSize,
     getItemSizeAccordingToType,
     getDefaultSize,
     getSeparatorOptions,
     updateParentData,
     prepareData,
     sectionAdd,
     sectionSplit,
     renderGrid,
     generateId,
     getGrid,
     level,
     grid,
     idFuck,
     parentId,
     store,
     storeData,
     storeType,
     storeContent,
     type,
     //grid,

     ...props
 }) => {

    let inited = false;



    useEffect(() => {
        props.updateCascade({
            data: storeData || getDefaultSize(idFuck, grid),
            type: storeType || type,
            idFuck,
            parentId,
        });

        // props.updateCascade({
        //     data: storeData,
        //     type,
        //     idFuck,
        //     parentId,
        // });
    }, []);

    function update(data) {
        props.updateCascade({
            data,
            type: storeType,
            idFuck,
            parentId,
        });
    }


    let tempDataSize = null;
    let realSize = {};
    let start = 0;
    let finish = 0;
    let onMouseUpEvent = null;
    let onMouseMoveEvent = null;
    let savedChildData = null;

    function del(id, data) {

    }

    function addSection(ids, idUnic, newType) {
        props.addCascade({
            idFuck,
            idChild: idUnic,
            index: ids,
            parentId,
            type: newType,
        });
        //update(storeData);
        // console.log(ids, idUnic, newType, parentId);
        // console.log(idFuck, store);
    }

    function deleteSection(ids, id) {
        console.log(ids, id);
        props.delCascade({
            index: ids,
            idFuck: id,
            parentId: idFuck,
        })
    }

    function updateData(ids, distance) {
        let nData = getUpdatedData(ids, storeType, distance, storeData, realSize);
        if(tempDataSize !== nData[ids].size) {
            tempDataSize = nData[ids].size;
            update(nData);
        }
    }

    function handleOnMouseDown(e, id) {
        let { clientDirection } = getSeparatorOptions(storeType);
        start = e[clientDirection];
        realSize = getRealSize(id, storeData);
        onMouseUpEvent = e => handleOnMouseUp(e, id);
        onMouseMoveEvent = e => handleOnMouseMove(e, id);
        document.addEventListener('mouseup', onMouseUpEvent, false);
        document.addEventListener('mousemove', onMouseMoveEvent, false);
    }

    function handleOnMouseMove(e, id) {
        let { clientDirection } = getSeparatorOptions(storeType);
        finish = e[clientDirection];
        let distance = finish - start;
        updateData(id, distance);
    }

    function handleOnMouseUp(e, id) {
        let { clientDirection } = getSeparatorOptions(storeType);
        finish = e[clientDirection];
        document.removeEventListener('mouseup', onMouseUpEvent, false);
        document.removeEventListener('mousemove', onMouseMoveEvent, false);
    }

    function returnContent(contentArray) {
        return contentArray.map((item, index) => {
            let { gridItem: style, separator: styleSeparator } = getItemSizeAccordingToType(item, storeType);
            return (
                <GridItem
                    key={item.idFuck}
                    id={index}
                    idUnic={item.idFuck}
                    currentData={contentArray}
                    isLast={contentArray[index+1]}
                    style={style}
                    styleSeparator={styleSeparator}
                    addSection={addSection}
                    deleteSection={deleteSection}
                    optionsSeparator={getSeparatorOptions(storeType)}
                    handleOnMouseDown={handleOnMouseDown}
                    generateId={generateId}
                    content={item.content}
                    element={item.element}
                    grid={item.grid}
                    type={item.type}
                    renderGrid={renderGrid}
                />
            )
        })
    }

    if(props.root) console.log(props.root);


    return (
        <Box
            className={classes.grid}
        >
            {
                storeData ? returnContent(storeData) : 'No Data LOL'
            }

        </Box>
    );
});

export default connect(
    (store, props) => {
        return {
            root: store.cascade,
            store: store.cascade[props.idFuck],
            storeData: store.cascade[props.idFuck] && store.cascade[props.idFuck].data,
            storeType: store.cascade[props.idFuck] && store.cascade[props.idFuck].type,
            storeContent: store.cascade[props.idFuck] && store.cascade[props.idFuck].content,
        }
    },
    dispatch => {
        return {
            updateCascade: (props) => dispatch(updateCascade(props)),
            addCascade: (props) => dispatch(add(props)),
            delCascade: (props) => dispatch(del(props)),
            getTest: (props) => dispatch(getTest(props)),

        }
    },
    null,
    //{ withRef: true }
)(Grid);