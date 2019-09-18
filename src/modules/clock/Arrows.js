import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { lighten, darken } from '@material-ui/core/styles/colorManipulator';
import {Arrow, Point} from './';

const styles = theme => ({
    arrows: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    center: {
        border: `1px solid ${darken(theme.palette.grey[300], 0.1)}`,
        width: 20,
        height: 20,
        backgroundColor: lighten(theme.palette.grey[800], 0.8),
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        zIndex: 1,
        borderRadius: '100%',
    },
});

const ArrowSecond = ({ ...props }) => {
    return (
        <Arrow
            width={140}
            height={5}
            {...props}
        />
    )
};

const ArrowMinute = ({ ...props }) => {
    return (
        <Arrow
            width={120}
            height={8}
            {...props}
        />
    )
};

const ArrowHour = ({ ...props }) => {
    return (
        <Arrow
            width={100}
            height={12}
            {...props}
        />
    )
};

export default withStyles(styles)(({ classes, time }) => {
    let { seconds, minutes, hours } = time;
    return (
        <Box
            className={classes.arrows}
        >
            <Box
                className={classes.center}
            />
            <Point>
                <ArrowHour deg={hours} />
            </Point>
            <Point>
                <ArrowMinute deg={minutes} />
            </Point>
            <Point>
                <ArrowSecond deg={seconds} />
            </Point>
        </Box>
    );
});