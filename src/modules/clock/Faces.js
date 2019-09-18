import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Face } from "./";

const styles = () => ({
    faces: {
        position: 'absolute',
        width: 'calc(70% + 5px)',
        height: 'calc(70% + 5px)',
        margin: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
});

export default withStyles(styles)(({ classes, ...props }) => {

    return (
        <Box
            className={classes.faces}
        >
            {
                Array.from({length: 60}, (step, index) => {
                    let deg = (index + 1) * 6;
                    return (
                        <Face
                            key={index}
                            pos={deg}
                            value={index + 1}
                            {...props}
                        />
                    );
                })
            }
        </Box>
    );
});