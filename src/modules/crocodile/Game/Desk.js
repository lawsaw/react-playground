import React, { PureComponent, forwardRef } from 'react';
import { withStyles, Paper } from "@material-ui/core";
import { DESK_WIDTH, DESK_HEIGHT } from '../helpers/constants';
import { getHeightFromWidth } from '../helpers/etc';
import { Resizer } from '../Components';

const styles = theme => ({
    desk: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    canvas: {
        // width: DESK_WIDTH,
        // height: DESK_HEIGHT,
        // [theme.breakpoints.up('md')]: {
        //     width: DESK_WIDTH+150,
        //     height: getHeightFromWidth(DESK_WIDTH+150, DESK_WIDTH, DESK_HEIGHT)
        // }
        // width: '100%',
        // height: '100%',
    }
});

class Desk extends PureComponent {

    componentDidMount() {
        const { onInit } = this.props;
        if(onInit) onInit();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.resizer.width !== this.props.resizer.width || prevProps.resizer.height !== this.props.resizer.height) {
            this.updateSize();
        }
    }

    updateSize = () => {
        const { resizer: { width, height }, innerRef } = this.props;
        let context = innerRef.current.getContext("2d");
        if(!context) return false;
        let temp = context.getImageData(0, 0, width, height);
        let dpr = window.devicePixelRatio || 1;
        innerRef.current.width = width * dpr;
        innerRef.current.height = height * dpr;
        context.putImageData(temp, 0, 0)
    }

    render() {
        const { classes, innerRef } = this.props;
        //console.log(this.props);
        return (
            <Paper
                elevation={5}
                square={true}
                className={classes.desk}
            >
                <canvas
                    ref={innerRef}
                    className={classes.canvas}
                />
            </Paper>
        )
    }
}

export default withStyles(styles)(
        forwardRef((props, ref) => <Desk
            innerRef={ref} {...props}
        />
    )
);

