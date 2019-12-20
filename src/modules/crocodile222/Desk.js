import React, { PureComponent, forwardRef } from 'react';
import { withStyles, Paper } from "@material-ui/core";
import { DESK_WIDTH, DESK_HEIGHT } from './constants';

const styles = () => ({
    desk: {
        position: 'relative',
    },
    canvas: {
        width: DESK_WIDTH,
        height: DESK_HEIGHT,
    }
});

class Desk extends PureComponent {

    componentDidMount() {
        const { onInit } = this.props;
        if(onInit) onInit();
    }

    render() {
        const { classes, innerRef } = this.props;
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

