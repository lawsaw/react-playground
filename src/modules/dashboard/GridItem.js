import React, { Fragment, useEffect } from 'react';
import { isElement } from 'react-dom/test-utils';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Toolbar, Window, Separator } from './';

const styles = () => ({
    gridItem: {
        position: 'absolute',
        width:  props => `${props.style.width}`    || 'auto',
        left:   props => `${props.style.left}`     || 'auto',
        height: props => `${props.style.height}`   || 'auto',
        top:    props => `${props.style.top}`      || 'auto',
        right:  props => `${props.style.right}`    || 'auto',
        bottom: props => `${props.style.bottom}`   || 'auto',
        transition: 'all 0.3s ease 0s',
    },
});

export default withStyles(styles)(({ classes, id, idUnic, content, element, currentData, isLast, styleSeparator, handleOnMouseDown, optionsSeparator, addSection, deleteSection }) => {



    // useEffect(() => {
         //console.log(idUnic);
    // });

    return (
        <Fragment>
            <Box
                className={classes.gridItem}
                ref={element}
            >
                {
                    !isElement(content) && (
                        <Toolbar
                            id={id}
                            idUnic={idUnic}
                            addSection={addSection}
                            deleteSection={deleteSection}
                        />
                    )
                }
                {
                    content && (
                        <Window>
                            {content}
                        </Window>
                    )
                }
            </Box>
            {
                isLast && (
                    <Separator
                        id={id}
                        style={styleSeparator}
                        options={optionsSeparator}
                        handleOnMouseDown={handleOnMouseDown}
                    />
                )
            }
        </Fragment>
    );
});