import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import cx from 'classnames';

const styles = () => ({
    face: {
        position: 'absolute',
        transform: props => `rotateZ(${props.pos + 45}deg)`,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        transformOrigin: 'center center',
    },
    content: {
        position: 'relative',
        display: 'block',
        transformOrigin: 'bottom center',
        transform: 'translateX(-50%) rotateZ(-45deg)',
    },
    content_num: {
        fontSize: 12,
        backgroundColor: '#000',
        width: 3,
        left: 15,
        height: 15,
    },
    content_stick: {
        backgroundColor: 'grey',
        width: 3,
        left: 6,
        height: 6,
    },
    value: {
        fontSize: 16,
        position: 'absolute',
        transformOrigin: 'center center',
        transform: 'translateX(-50%) translateY(calc(-100% - 5px))',
    },
    valueContent: {
        position: 'relative',
        transformOrigin: 'center center',
        transform: props => `rotateZ(${-props.pos}deg)`,
    }
});

export default withStyles(styles)(({ classes, value }) => {

    let isMainValue = value % 5 === 0;

    return (
        <Box
            className={classes.face}
        >
            <Box
                className={cx(classes.content, isMainValue ? classes.content_num : classes.content_stick)}
            >
                {
                    isMainValue && (
                        <Box
                            className={classes.value}
                        >
                            <Box
                                className={classes.valueContent}
                            >
                                {value/5}
                            </Box>
                        </Box>
                    )
                }
            </Box>
        </Box>
    );
});