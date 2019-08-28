import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
//import { lighten } from '@material-ui/core/styles/colorManipulator';

const styles = (theme) => ({
    point: {
        position: 'absolute',
        //backgroundColor: lighten(theme.palette.grey[200], 0.2),
        width: 20,
        height: 20,
        transformOrigin: 'center center',
        top: '50%',
        left: '50%',
        transform: 'translate3d(-50%, -50%, 0) rotateZ(-90deg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: '100%',
    }
});

export default withStyles(styles)(({ classes, children, ...props }) => {
    return (
        <Box
            className={classes.point}
        >
            {children}
        </Box>
    );
});