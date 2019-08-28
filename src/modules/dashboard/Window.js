import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const styles = () => ({
    window: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        padding: 35,
    },
});

export default withStyles(styles)(({ classes, children }) => {

    return (
        <Box
            className={classes.window}
        >
            {children}
        </Box>
    );
});