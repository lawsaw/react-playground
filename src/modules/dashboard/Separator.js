import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const styles = () => ({
    separator: {
        position: 'absolute',
        width:      props => `${props.style.width}`    || 'auto',
        left:       props => `${props.style.left}`     || 'auto',
        height:     props => `${props.style.height}`   || 'auto',
        top:        props => `${props.style.top}`      || 'auto',
        right:      props => `${props.style.right}`    || 'auto',
        bottom:     props => `${props.style.bottom}`   || 'auto',
        transform:  props => `translate3d(${-props.style.width/2 || 0}px, ${-props.style.height/2 || 0}px, 0)`,
        backgroundColor: 'lightgreen',
        zIndex: 2,
        cursor: props => props.options.cursor,
        '&:hover': {
            backgroundColor: 'lightblue',
        },
    },
});

export default withStyles(styles)(({ classes, id, handleOnMouseDown }) => {

    useEffect(() => {
        //console.log('Separator');
    }, []);

    return (
        <Box
            className={classes.separator}
            onMouseDown={(e) => handleOnMouseDown(e, id)}
        />
    );
});