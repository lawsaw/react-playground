import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { GridItem, F } from './';
import { connect } from "react-redux";
import { updateCascade, add, del } from "./redux/actions";

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
     grid,
     idFuck,
     parentId,
     store,
     storeData,
     storeType,
     storeContent,
     type,
     ...props
 }) => {

    useEffect(() => {
        props.updateCascade({
            data: storeData || F.getDefaultSize(idFuck, storeData || grid),
            type: storeType || type,
            idFuck,
            parentId,
        });
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

    function addSection(index, idChild, type) {
        props.addCascade({
            idFuck,
            idChild,
            index,
            parentId,
            type,
        });
    }

    function deleteSection(index, id) {
        props.delCascade({
            index,
            idFuck: id,
            parentId: idFuck,
            grandParentId: parentId,
        })
    }

    function updateData(ids, distance) {
        let nData = F.getUpdatedData(ids, storeType, distance, storeData, realSize);
        if(tempDataSize !== nData[ids].size) {
            tempDataSize = nData[ids].size;
            update(nData);
        }
    }

    function handleOnMouseDown(e, id) {
        let { clientDirection } = F.getSeparatorOptions(storeType);
        start = e[clientDirection];
        realSize = F.getRealSize(id, storeData);
        onMouseUpEvent = e => handleOnMouseUp(e);
        onMouseMoveEvent = e => handleOnMouseMove(e, id);
        document.addEventListener('mouseup', onMouseUpEvent, false);
        document.addEventListener('mousemove', onMouseMoveEvent, false);
    }

    function handleOnMouseMove(e, id) {
        let { clientDirection } = F.getSeparatorOptions(storeType);
        finish = e[clientDirection];
        let distance = finish - start;
        updateData(id, distance);
    }

    function handleOnMouseUp(e) {
        let { clientDirection } = F.getSeparatorOptions(storeType);
        finish = e[clientDirection];
        document.removeEventListener('mouseup', onMouseUpEvent, false);
        document.removeEventListener('mousemove', onMouseMoveEvent, false);
    }

    function returnContent(contentArray) {
        return contentArray.map((item, index) => {
            let { gridItem: style, separator: styleSeparator } = F.getItemSizeAccordingToType(item, storeType);
            return (
                <GridItem
                    key={item.idFuck}
                    index={index}
                    item={item}
                    parentId={contentArray[0].parentId}
                    isLast={contentArray[index+1]}
                    style={style}
                    styleSeparator={styleSeparator}
                    addSection={addSection}
                    deleteSection={deleteSection}
                    optionsSeparator={F.getSeparatorOptions(storeType)}
                    handleOnMouseDown={handleOnMouseDown}
                />
            )
        })
    }

    return (
        <Box
            className={classes.grid}
        >
            {
                storeData ? returnContent(storeData) : 'No Data LoL'
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
        }
    },
    null,
)(Grid);