import React, { createRef, PureComponent, Fragment } from 'react';
import UndoCanvas from 'undo-canvas';
import { withStyles, Grid, Box, Paper } from "@material-ui/core";
import { Desk, DeskToolbar } from './';
import { DESK_WIDTH, DESK_HEIGHT } from '../helpers/constants';
import { getHeightFromWidth } from '../helpers/etc';
import { Resizer } from '../Components';

const MOUSE_MAIN_BUTTON = 0;
const MOUSE_SECONDARY_BUTTON = 2;
const MOUSE_MIDDLE_BUTTON = 1;

let context = null;

const styles = theme => ({
    desk: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    canvas: {
        // width: props => (props.resize || {}).width,
        // height: props => (props.resize || {}).height,
    },
    paint: {
        // width: '100%',
        // height: '100%',
        //width: DESK_WIDTH,
        //margin: '0 auto',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        //height: DESK_HEIGHT,
        // [theme.breakpoints.up('md')]: {
        //     width: DESK_WIDTH+150,
        //     //height: getHeightFromWidth(DESK_WIDTH+150, DESK_WIDTH, DESK_HEIGHT)
        // }
    },
    toolbar: {

    },
    screen: {
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

class Paint extends PureComponent {

    constructor(props) {
        super(props);
        this.canvas = createRef();
        this.isDrawing = false;
    }

    state = {
        //context: null,
        lineOptions: {
            lineWidth: 20,
            lineJoin: 'round',
            lineCap: 'round',
            strokeStyle: '#ff00ff',
        },
    }

    componentDidMount() {
        this.handleInit();
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(prevProps.resizer.width !== this.props.resizer.width || prevProps.resizer.height !== this.props.resizer.height) {
    //         this.updateSize();
    //     }
    // }

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
        let { parentElement: { offsetWidth, offsetHeight } } = this.canvas.current;
        let dpr = window.devicePixelRatio || 1;
        //let rect = canvas.getBoundingClientRect();
        canvas.width = offsetWidth * dpr;
        canvas.height = offsetHeight * dpr;
        context = canvas.getContext("2d");
        context.scale(dpr, dpr);
        UndoCanvas.enableUndo(context);
        canvas.addEventListener('mousedown', this.handleMouseDown, false);
        canvas.addEventListener('mouseup', this.handleMouseUp, false);
        canvas.addEventListener('mousemove', this.handleMouseMove, false);
    }

    // updateSize = () => {
    //     const { resizer: { width, height } } = this.props;
    //     console.log(width, height);
    //     //const canvas = this.canvas.current;
    //
    //
    //     // let temp_cnvs = document.createElement('canvas');
    //     // let temp_cntx = temp_cnvs.getContext('2d');
    //     // temp_cnvs.width = width;
    //     // temp_cnvs.height = height;
    //     // temp_cntx.fillRect(0, 0, width, height);
    //     // temp_cntx.drawImage(this.canvas.current, 0, 0);
    //
    //
    //     let temp = context.getImageData(0, 0, width, height);
    //     let dpr = window.devicePixelRatio || 1;
    //     this.canvas.current.width = width * dpr;
    //     this.canvas.current.height = height * dpr;
    //     //context.scale(dpr, dpr);
    //     //context.drawImage(temp_cnvs, 0, 0);
    //     // context = canvas.getContext("2d");
    //     context.putImageData(temp, 0, 0)
    //     // context.scale(dpr, dpr);
    //     // context.stroke();
    // }

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
        //console.log(lineWidth);
        this.setState(state => ({
            lineOptions: {
                ...state.lineOptions,
                lineWidth,
            },
        }));
    }

    render() {
        const { classes, resizer } = this.props;
        const { lineOptions: { lineWidth } } = this.state;
        //console.log(resizer);
        return (
            <Grid
                container
                className={classes.paint}
            >
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
                    <Resizer
                        k={0.75}
                    >
                        <Desk
                            innerRef={this.canvas}
                        />
                        {/*<Paper*/}
                        {/*    elevation={5}*/}
                        {/*    square={true}*/}
                        {/*    className={classes.desk}*/}
                        {/*>*/}
                        {/*    <canvas*/}
                        {/*        ref={this.canvas}*/}
                        {/*        className={classes.canvas}*/}
                        {/*        // style={{*/}
                        {/*        //     width: `${(resizer || {}).width}px`,*/}
                        {/*        //     height: `${(resizer || {}).height}px`,*/}
                        {/*        // }}*/}
                        {/*    />*/}
                        {/*</Paper>*/}
                    </Resizer>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Paint);