import React, { PureComponent, createRef } from 'react';
import { withStyles, Paper } from "@material-ui/core";
import { DESK_WIDTH, DESK_HEIGHT } from './constants';

const MOUSE_MAIN_BUTTON = 0;
const MOUSE_SECONDARY_BUTTON = 2;
const MOUSE_MIDDLE_BUTTON = 1;

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

    constructor(props) {
        super(props);
        this.canvas = createRef();
        this.isDrawing = false;
        this.state = {
            context: null,
            steps: [],
        }
    }

    componentDidMount() {
        this.createContext();
        this.canvas.current.addEventListener('mousedown', this.handlerMouseDown);
        this.canvas.current.addEventListener('mouseup', this.handlerMouseUp);
        this.canvas.current.addEventListener('mousemove', this.handlerMouseMove, false);
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     this.updateLine();
    // }

    createContext = () => {
        const canvas = this.canvas.current;
        let dpr = window.devicePixelRatio || 1;
        let rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        let context = canvas.getContext("2d");
        context.scale(dpr, dpr);
        this.setState(() => ({
            context,
        }));
    }

    updateLine = () => {
        const { lineOptions } = this.props;
        const { context } = this.state;
        console.log(lineOptions);
        for(let option in lineOptions) context[option] = lineOptions[option];
    }

    getCoords = ({ target, clientX, clientY}) => {
        const { left, top } = target.getBoundingClientRect();
        return {
            x: clientX - left,
            y: clientY - top,
        };
    }

    makeStep = (e) => {
        const { onDrawing } = this.props;
        const { context } = this.state;
        const { x, y } = this.getCoords(e);
        context.lineTo(x, y);
        context.stroke();
        onDrawing({
            action: 'lineTo',
            coords: {x, y},
        });
        return {x, y};
    }

    handlerMouseDown = (e) => {
        const { button } = e;
        if(button === MOUSE_MAIN_BUTTON) {
            const { onDrawing } = this.props;
            const { context } = this.state;
            this.isDrawing = true;
            this.updateLine();
            context.beginPath();
            const { x, y } = this.getCoords(e);
            context.moveTo(x, y);
            onDrawing({
                action: 'moveTo',
                coords: {x, y},
            });
        }
    }

    handlerMouseUp = (e) => {
        const { button } = e;
        if(button === MOUSE_MAIN_BUTTON) {
            this.isDrawing = false;
            const { x, y } = this.makeStep(e);
            this.setState(state => ({
                steps: [
                    ...state.steps,
                    [x, y],
                ]
            }))
        }
    }

    handlerMouseMove = (e) => {
        if(this.isDrawing) {
            this.makeStep(e);
        }
    }

    render() {
        console.log(this.state.steps);
        const { classes } = this.props;
        return (
            <Paper
                elevation={5}
                square={true}
                className={classes.desk}
            >
                <canvas
                    ref={this.canvas}
                    className={classes.canvas}
                />
            </Paper>
        )
    }
}

export default withStyles(styles)(Desk);