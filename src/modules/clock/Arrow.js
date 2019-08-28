import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const styles = (theme) => ({
    arrow: {
        position: 'relative',
        backgroundColor: lighten(theme.palette.grey[800], 0.8),
        width: props => (props.width || 140),
        height: props => (props.height || 10),
        transformOrigin: 'left center',
        left: '50%',
        transform: props => `rotateZ(${props.deg}deg)`,
        //transition: 'all 1s linear 0s',
    }
});

export default withStyles(styles)(({ classes, className, ...props }) => {
    return (
        <Box
            className={classes.arrow}
        />
    );
});