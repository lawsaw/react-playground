import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Toolbar } from './';

const styles = () => ({
    content: {
        position: 'absolute',
        width: props => props.type === 'col' ? `${props.size}%` : 'auto',
        height: props => props.type === 'row' ? `${props.size}%` : 'auto',
        left: props => props.type === 'col' ? `${props.space}%` : 0,
        top: props => props.type === 'row' ? `${props.space}%` : 0,
        right: props => props.type === 'row' ? 0 : 'auto',
        bottom: props => props.type === 'col' ? 0 : 'auto',
    },
});

export default withStyles(styles)(({ classes, createSection }) => {


    return (
        <Box
            className={classes.content}
        >
            {
                false ? 0 : (
                    <Toolbar
                        createSection={createSection}
                    />
                )
            }

        </Box>
    );
});