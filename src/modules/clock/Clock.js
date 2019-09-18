import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Arrows, Faces } from './';

const styles = (theme) => ({
    clock: {
        position: 'relative',
        width: 300,
        height: 300,
        borderRadius: '100%',
        backgroundColor: lighten(theme.palette.grey[500], 0.5),
    },
});

const getHoursInAnalogFormat = hours => hours > 12 ? hours - 12 : hours;

const makeValueCircled = () => {
    let circle = 0;
    return value => {
        if(value === 0) circle += 360;
        value = circle + value;
        return value;
    }
};

let makeSecondsCircled = makeValueCircled();
let makeMinutesCircled = makeValueCircled();
let makeHoursCircled = makeValueCircled();

const getTime = () => {
    let time = new Date();
    let s = time.getSeconds();
    let m = time.getMinutes();
    let h = time.getHours();
    let seconds = s * 6;
    let minutes = m * 6 + s/60;
    let hours = getHoursInAnalogFormat(h) * 30 + minutes/12;
    seconds = makeSecondsCircled(seconds);
    minutes = makeMinutesCircled(minutes);
    hours = makeHoursCircled(hours);
    //console.log(seconds, minutes, hours);
    return {seconds, minutes, hours}
};

let tempTime = getTime();

export default withStyles(styles)(({ classes }) => {

    const [time, setTime] = useState(tempTime || getTime());

    useEffect(() => {
        let timer = setTimeout(() => {
            tempTime = getTime();
            setTime(tempTime);
        }, 1000);
        return () => {
            clearTimeout(timer);
            tempTime = null;
        }
    }, [time]);

    return (
        <Box
            className={classes.clock}
        >
            <Faces />
            <Arrows time={time} />
        </Box>
    );
});