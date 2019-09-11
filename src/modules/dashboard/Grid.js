import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { GridItem, F } from './';
import { connect } from "react-redux";
import { update, add, del } from "./redux/actions";

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
     idCurrent,
     idParent,
     storeData,
     storeType,
     storeContent,
     type,
     ...props
 }) => {

    useEffect(() => {
        props.update({
            data: storeData || F.getDefaultSize(idCurrent, storeData || grid),
            type: storeType || type,
            idCurrent,
            idParent,
        });
    }, []);

    function update(data) {
        props.update({
            data,
            type: storeType,
            idCurrent,
            idParent,
        });
    }

    let tempDataSize = null;
    let realSize = {};
    let start = 0;
    let finish = 0;
    let onMouseUpEvent = null;
    let onMouseMoveEvent = null;

    function addSection(index, idChild, type) {
        props.add({
            idCurrent,
            idChild,
            index,
            idParent,
            type,
        });
    }

    function deleteSection(index, id) {
        props.del({
            index,
            idCurrent: id,
            idParent: idCurrent,
            idGrandParent: idParent,
        })
    }

    function updateData(index, distance) {
        let data = F.getUpdatedData(index, storeType, distance, storeData, realSize);
        if(tempDataSize !== data[index].size) {
            tempDataSize = data[index].size;
            update(data);
        }
    }

    function handleOnMouseDown(e, index) {
        let { clientDirection } = F.getSeparatorOptions(storeType);
        start = e[clientDirection];
        realSize = F.getRealSize(index, storeData);
        onMouseUpEvent = e => handleOnMouseUp(e);
        onMouseMoveEvent = e => handleOnMouseMove(e, index);
        document.addEventListener('mouseup', onMouseUpEvent, false);
        document.addEventListener('mousemove', onMouseMoveEvent, false);
    }

    function handleOnMouseMove(e, index) {
        let { clientDirection } = F.getSeparatorOptions(storeType);
        finish = e[clientDirection];
        let distance = finish - start;
        updateData(index, distance);
    }

    function handleOnMouseUp(e) {
        let { clientDirection } = F.getSeparatorOptions(storeType);
        finish = e[clientDirection];
        document.removeEventListener('mouseup', onMouseUpEvent, false);
        document.removeEventListener('mousemove', onMouseMoveEvent, false);
    }

    function returnContent(data) {
        return data.map((item, index) => {
            let { gridItem: style, separator: styleSeparator } = F.getItemSizeAccordingToType(item, storeType);
            return (
                <GridItem
                    key={item.idCurrent}
                    index={index}
                    item={item}
                    idParent={data[0].idParent}
                    isLast={data[index+1]}
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
            storeData: store.cascade[props.idCurrent] && store.cascade[props.idCurrent].data,
            storeType: store.cascade[props.idCurrent] && store.cascade[props.idCurrent].type,
            storeContent: store.cascade[props.idCurrent] && store.cascade[props.idCurrent].content,
        }
    },
    dispatch => {
        return {
            update: props => dispatch(update(props)),
            add: props => dispatch(add(props)),
            del: props => dispatch(del(props)),
        }
    },
    null,
)(Grid);