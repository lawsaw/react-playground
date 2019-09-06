import React, { Component, useState, useEffect, useContext, useReducer } from 'react';
import { withStyles } from '@material-ui/core';
import { isElement } from 'react-dom/test-utils';
import Box from '@material-ui/core/Box';
import {GridItem, Grid as GridComponent, setStore, rootStore} from './';
import { connect } from "react-redux";
import { updateCascade, getTest } from "./redux/actions";
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
     getGrid,
     level,
     grid,
     idFuck,
     //type,
     //grid,

     ...props
 }) => {

    //class Grid extends Component {

    //let grid = findFirst(rootStore, 'grid', { idFuck }).grid || props.grid;

    let inited = false;

    //const { store, dispatch } = useContext(StoreContext);

    //let grid = dispatch({type: 'get', id: idFuck});

    const [data, setData] = useState(getDefaultSize(grid));
    //let data = getDefaultSize(grid);


    const [type, setType] = useState(props.type);

    //setStore({action: 'update', data, type, id: idFuck});

    //let data = getGrid(store, idFuck) || null;

    // useEffect(() => {
    //     if(!inited) {
    //         dispatch({type: 'set', data: getDefaultSize(grid), id: idFuck});
    //         console.log(data);
    //         console.log(store);
    //         inited = true;
    //     }
    // }, []);


    //let data = null;
    //let request = findFirst(props.cascade, 'grid', { idFuck }).grid;
    //data = request && request[0].size ? request : null;
    //console.log({idFuck, data, request});

    //const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {

        props.updateCascade({
            data,
            type,
            id: idFuck,
        });
        console.log({idFuck, data});
        //forceUpdate();

    }, [idFuck]);



    // useEffect(() => {
    //     console.log('111111111111111111111111');
    //
    //     return () => {
    //
    //         console.log('2222222222222222222');
    //     }
    // });



    let tempDataSize = null;
    let realSize = {};
    let start = 0;
    let finish = 0;
    let onMouseUpEvent = null;
    let onMouseMoveEvent = null;
    let savedChildData = null;


    //console.log(props.cascade);

    function update(id, data) {
        //dispatch({type: 'set', data, id});
        //let currentData = getGrid(id);
        setData(data);

        props.updateCascade({
            data,
            type,
            id: idFuck,
        });
        //console.log(data);
    }

    //console.log(props);

    function del(id, data) {

    }

    function addSection(ids, idUnic, newType) {
        // console.log(props);
        // props.setFilter('action');
        let newData;
        //let current = findFirst(rootStore, 'grid', { idFuck }).grid;
        let current = data;

        if(newType === type) {
            // newData = sectionAdd(ids, current);
            // update(idFuck, newData);
            console.log(`case: 1; idFuck: ${idFuck}; ids: ${ids}; length: ${data.length}`);
            //console.log({newData, rootStore});
        } else if(newType !== type) {
            if(current.length === 1) {
                // setType(newType);
                // newData = sectionAdd(ids, current);
                // update(idFuck, newData);
                console.log(`case: 2; idFuck: ${idFuck}; ids: ${ids}; length: ${data.length}`);
                //console.log({newData, rootStore});
            } else {
                // newData = sectionSplit(ids, idUnic, idFuck, data, newType);
                // update(idFuck, newData);
                console.log(`case: 3; idFuck: ${idFuck}; ids: ${ids}; length: ${data.length}`);
                //console.log({newData, rootStore});
            }
        }

    }


    function deleteSection(ids, id) {
        let cloneData = [...data];
        if(idFuck === 'root' && data.length === 1) {
            console.log(`case: del_1; idFuck: ${idFuck}; id: ${id}; ids: ${ids}; length: ${data.length}`);
            //console.log({rootStore});
            return false;
        } else if(data.length === 2) {
            cloneData.splice(ids, 1);
            //let child = findFirst(props.cascade, 'grid', { idFuck: cloneData[0].idFuck });
            let child = findFirst(null, 'grid', { idFuck: cloneData[0].idFuck });
            if(child && child.content && child.content.type === <GridComponent />.type) {
                // cloneData.type = child.type;
                // cloneData.content = child.content;
                // cloneData.grid = child.grid;
                //cloneData = cloneData[0].grid;
                //setType(child.type);
                //cloneData = [...child];
                //update(id, cloneData.grid);
                console.log(`case: del_3; idFuck: ${idFuck}; id: ${id}; ids: ${ids}; length: ${data.length}`);
            } else {
                console.log(`case: del_4; idFuck: ${idFuck}; id: ${id}; ids: ${ids}; length: ${data.length}`);
            }
        } else {
            console.log({
                length: data.length,
                cloneData,
                //cascade: props.cascade,
                idFuck,
            });
            //cloneData.splice(ids, 1);
            //update(id, getDefaultSize(cloneData, false));
            console.log(`case: del_5; idFuck: ${idFuck}; id: ${id}; ids: ${ids}; length: ${data.length}`);
            // console.log({cloneData, rootStore});
            // return false;

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
    //console.log({idFuck, data, rootStore});

    function returnContent(contentArray) {
        return contentArray.map((item, index) => {
            let { gridItem: style, separator: styleSeparator } = getItemSizeAccordingToType(item, type);
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
                    optionsSeparator={getSeparatorOptions(type)}
                    handleOnMouseDown={handleOnMouseDown}
                    content={item.content}
                    element={item.element}
                    grid={item.grid}
                    type={item.type}
                    renderGrid={renderGrid}
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

export default connect(
    // null,
    // { updateCascade }

    store => {
        return {
            cascade: store.cascade,
        }
    },
    dispatch => {
        return {
            updateCascade: (props) => dispatch(updateCascade(props)),
            getTest: (props) => dispatch(getTest(props)),

        }
    },
    null,
    //{ withRef: true }
)(Grid);