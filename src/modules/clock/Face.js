import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const styles = () => ({
    face: {
        position: 'absolute',
        transform: props => `rotateZ(${props.pos}deg)`,
        width: '80%',
        height: '80%',
        margin: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        transformOrigin: 'center center',
    },
    value: {
        position: 'relative',
        //backgroundColor: 'red',
        display: 'inline-block',
        transformOrigin: 'center center',
        transform: 'rotateZ(-45deg)',
    },
});

export default withStyles(styles)(({ classes, children, ...props }) => {
    return (
        <Box
            className={classes.face}
        >
            <Box
                className={classes.value}
            >
                {children}
            </Box>
        </Box>
    );
});