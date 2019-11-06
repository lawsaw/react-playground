import React, { createRef, PureComponent, Fragment } from 'react';
import UndoCanvas from 'undo-canvas';
import { withStyles, Grid } from "@material-ui/core";
import { Desk, DeskToolbar } from './';

const MOUSE_MAIN_BUTTON = 0;
const MOUSE_SECONDARY_BUTTON = 2;
const MOUSE_MIDDLE_BUTTON = 1;

let context = null;

const styles = () => ({
    paint: {},
    toolbar: {
        flexGrow: 1,
    },
    screen: {},
});

class Paint extends PureComponent {

    constructor(props) {
        super(props);
        this.canvas = createRef();
        this.isDrawing = false;
    }

    state = {
        lineOptions: {
            lineWidth: 20,
            lineJoin: 'round',
            lineCap: 'round',
            strokeStyle: '#ff00ff',
        },
    }

    handlerColorSelect = (color) => {
        this.setState(state => ({
            lineOptions: {
                ...state.lineOptions,
                strokeStyle: color,
            }
        }));
    }

    getCoords = ({ target, clientX, clientY }) => {
        const { left, top } = target.getBoundingClientRect();
        return {
            x: clientX - left,
            y: clientY - top,
        };
    }

    updateLine = () => {
        const { lineOptions } = this.state;
        for(let option in lineOptions) context[option] = lineOptions[option];
    }

    makeStep = (e) => {
        const { onConvertToImage } = this.props;
        const { x, y } = this.getCoords(e);
        context.lineTo(x, y);
        context.stroke();
        onConvertToImage(this.canvas);
        return {x, y};
    }

    handleInit = () => {
        const canvas = this.canvas.current;
        let dpr = window.devicePixelRatio || 1;
        let rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context = canvas.getContext("2d");
        context.scale(dpr, dpr);
        UndoCanvas.enableUndo(context);
        canvas.addEventListener('mousedown', this.handleMouseDown, false);
        canvas.addEventListener('mouseup', this.handleMouseUp, false);
        canvas.addEventListener('mousemove', this.handleMouseMove, false);
    }

    handleMouseDown = (e) => {
        const { button } = e;
        if(button === MOUSE_MAIN_BUTTON) {
            this.isDrawing = true;
            const { onConvertToImage } = this.props;
            context.putTag();
            this.updateLine();
            context.beginPath();
            const { x, y } = this.getCoords(e);
            context.moveTo(x, y);
            onConvertToImage(this.canvas);
        }
    }

    handleMouseUp = (e) => {
        const { button } = e;
        if(button === MOUSE_MAIN_BUTTON) {
            this.isDrawing = false;
            this.makeStep(e);
            context.putTag();
        }
    }

    handleMouseMove = (e) => {
        if(this.isDrawing) this.makeStep(e);
    }

    handleUndo = () => {
        const { onConvertToImage } = this.props;
        context.undoTag();
        onConvertToImage(this.canvas);
    }

    handleRedo = () => {
        const { onConvertToImage } = this.props;
        context.redoTag();
        onConvertToImage(this.canvas);
    }

    handleClear = () => {
        const { onConvertToImage } = this.props;
        context.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
        onConvertToImage(this.canvas);
    }

    handleSizeChange = (e, lineWidth) => {
        console.log(lineWidth);
        this.setState(state => ({
            lineOptions: {
                ...state.lineOptions,
                lineWidth,
            },
        }));
    }

    render() {
        const { classes } = this.props;
        const { lineOptions: { lineWidth } } = this.state;
        return (
            <Fragment>
                <Grid
                    item
                    className={classes.toolbar}
                >
                    <DeskToolbar
                        onColorSelect={this.handlerColorSelect}
                        onUndo={this.handleUndo}
                        onRedo={this.handleRedo}
                        onClear={this.handleClear}
                        onSizeChange={this.handleSizeChange}
                        lineWidth={lineWidth}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.screen}
                >
                    <Desk
                        ref={this.canvas}
                        onInit={this.handleInit}
                    />
                </Grid>
            </Fragment>
        )
    }
}

export default withStyles(styles)(Paint);