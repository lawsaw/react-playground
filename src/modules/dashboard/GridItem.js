import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Grid, Toolbar, Window, Separator } from './';

const styles = () => ({
    gridItem: {
        position: 'absolute',
        width:  props => `${props.style.width}`  || 'auto',
        left:   props => `${props.style.left}`   || 'auto',
        height: props => `${props.style.height}` || 'auto',
        top:    props => `${props.style.top}`    || 'auto',
        right:  props => `${props.style.right}`  || 'auto',
        bottom: props => `${props.style.bottom}` || 'auto',
        transition: 'all 0.3s ease 0s',
    },
});

export default withStyles(styles)(({
        classes,
        index,
        item: { idFuck, content, element, grid, type },
        parentId,
        isLast,
        styleSeparator,
        handleOnMouseDown,
        optionsSeparator,
        addSection,
        deleteSection
    }) => {

    const HAS_GRID = Boolean(grid && grid.length);

    return (
        <Fragment>
            <Box
                className={classes.gridItem}
                ref={element}
            >
                {
                    !HAS_GRID && (
                        <Fragment>

                            <Toolbar
                                index={index}
                                idFuck={idFuck}
                                addSection={addSection}
                                deleteSection={deleteSection}
                            />

                        </Fragment>
                    )
                }
                <Window>
                    {
                        HAS_GRID ? (
                            <Grid
                                idFuck={idFuck}
                                parentId={parentId}
                                grid={grid}
                                type={type}
                            />
                        ) : content ? content : 'No LoL'
                    }
                </Window>
            </Box>
            {
                isLast && (
                    <Separator
                        index={index}
                        style={styleSeparator}
                        options={optionsSeparator}
                        handleOnMouseDown={handleOnMouseDown}
                    />
                )
            }
        </Fragment>
    );
});