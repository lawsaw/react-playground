import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Arrow, Point, Face } from './';

let timer = null;

const styles = (theme) => ({
    clock: {
        position: 'relative',
        width: 300,
        height: 300,
        borderRadius: '100%',
        backgroundColor: lighten(theme.palette.grey[500], 0.5),
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

const ClockFace = ({ ...props }) => {
  return Array.from({length: 12}, (step, index) => {
      let deg = ((index + 1) * 30) + 45;
      return (
          <Face
              key={index}
              pos={deg}
              {...props}
          >
              {index + 1}
          </Face>
      );
  });
};

const setTime = (setSeconds, setMinutes, setHours) => {
    let time = new Date();
    let seconds = time.getSeconds() * 6;
    let minutes = time.getMinutes() * 6 + seconds/60;
    let hours = (time.getHours() > 12 ? (time.getHours() - 12) * 30/(1/5) : time.getHours() * 30/(1/5)) + minutes/60;
    setSeconds(seconds);
    setMinutes(minutes);
    setHours(hours);
    //console.log(seconds, minutes, hours);
}

export default withStyles(styles)(({ classes, ...props }) => {

    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);

    useEffect(() => {
       if(seconds === 0) {
           setTime(setSeconds, setMinutes, setHours);
       }
    }, [seconds]);

    useEffect(() => {
        timer = setTimeout(() => {
            setTime(setSeconds, setMinutes, setHours);
        }, 1000);
        return () => {
            clearTimeout(timer);
        }
    }, [seconds]);

    return (
        <Box
            className={classes.clock}
        >
            <ClockFace />
            <Point>
                <ArrowSecond deg={seconds} />
            </Point>
            <Point>
                <ArrowMinute deg={minutes} />
            </Point>
            <Point>
                <ArrowHour deg={hours} />
            </Point>

        </Box>
    );
});