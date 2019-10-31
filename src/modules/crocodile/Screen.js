import React, { PureComponent, createRef } from 'react';
import { isEqual } from 'lodash';
import { withStyles, Paper } from "@material-ui/core";
import { DESK_WIDTH, DESK_HEIGHT } from './constants';

const styles = () => ({
    screen: {
       position: 'relative',
    },
    canvas: {
        width: 100,
        height: 100,
    }
});

class Screen extends PureComponent {

    constructor(props) {
        super(props);
        this.canvas = createRef();
        this.context = null;
        this.state = {
            context: null,
        }
    }

    componentDidMount() {
        this.createContext();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!isEqual(prevProps, this.props)) this.update();
    }

    createContext = () => {
        const canvas = this.canvas.current;
        let dpr = window.devicePixelRatio || 1;
        canvas.width = DESK_WIDTH * dpr;
        canvas.height = DESK_HEIGHT * dpr;
        let context = canvas.getContext("2d");
        context.scale(dpr, dpr);
        this.setState(() => ({
            context,
        }));
    }

    update = () => {
        const { action, coords: { x, y }, lineOptions } = this.props;
        const { context } = this.state;
        for(let option in lineOptions) context[option] = lineOptions[option];
        switch(action) {
            case 'moveTo':
                context.beginPath();
                context[action](x, y);
                break;
            case 'lineTo':
                context[action](x, y);
                context.stroke();
                break;
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper
                elevation={5}
                square={true}
                className={classes.screen}
            >
                <canvas
                    ref={this.canvas}
                    className={classes.canvas}
                />
            </Paper>
        )
    }
}

export default withStyles(styles)(Screen);