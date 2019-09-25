import React, { Component } from 'react';
import { cloneDeep, isEqual } from 'lodash';
import Box from "@material-ui/core/Box";
import { withStyles } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from "./redux/store";
//import MaterialButton from '@material-ui/core/Button';
import { Grid } from './';
import { FIGURES, ROTATION_CIRCLE } from './constants';

// const StyledMaterialButton = withStyles(theme => ({
//     root: {
//         padding: 3,
//         minWidth: 'auto',
//         '& svg': {
//             fontSize: theme.typography.pxToRem(16),
//         },
//     },
// }))(MaterialButton);

const styles = () => ({
    tetris: {
        position: 'relative',
    }
});

// const KEY_EVENTS = {
//     'ArrowUp':    'up',
//     'ArrowLeft':  'left',
//     'ArrowRight': 'right',
//     'ArrowDown':  'down',
//     'Space':      'rotate',
// }

class Tetris extends Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            table: this.generateGrid(10, 20),
            rotation: 'left',
            figure: FIGURES['L'],
            position: [2,4],
            duration: 1000,

        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
        //this.startTimer();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    startTimer = () => {
        this.timer = setTimeout(() => {
            let [rowPosition, colPosition] = this.state.position;
            this.setState(() => ({
                position: [++rowPosition, colPosition],
            }));
            this.startTimer();
        }, 750);
    }

    generateGrid = (hor, ver) => {
        return Array.from({length: ver}, () => Array.from({length: hor}, () => 0));
    }

    mergeFigure = (figure, grid, [rowPosition, colPosition]) => {
        //console.log(rowPosition, colPosition);
        let table = cloneDeep(grid);
        return table.map((row, rowIndex) => {
            if(rowIndex === rowPosition) {
                figure.forEach((figureRow, figureRowIndex) => {
                    table[rowIndex + figureRowIndex].splice(colPosition, figureRow.length, ...figureRow);
                });
            }
            return row.map(col => col);
        });
    }

    getNextRotationPosition = (figure) => {
        let { length } = ROTATION_CIRCLE;
        let index = ROTATION_CIRCLE.indexOf(figure);
        return index === length-1 ? ROTATION_CIRCLE[0] : ROTATION_CIRCLE[index+1];
    }

    getPrevRotationPosition = (figure) => {
        let { length } = ROTATION_CIRCLE;
        let index = ROTATION_CIRCLE.indexOf(figure);
        return index === 0 ? ROTATION_CIRCLE[length-1] : ROTATION_CIRCLE[index-1];
    }

    isFigureCloseToLeft = () => {
        let colPosition = this.state.position[1];
        return colPosition-1 >= 0;
    }

    isFigureCloseToRight = (rotation) => {
        const { position, table, figure } = this.state;
        let colPosition = position[1];
        return colPosition < (table[0].length - figure[rotation][0].length);
    }

    getFigureOutsideSpace = (rotation) => {
        const { position: [rowPosition, colPosition], table, figure } = this.state;
        let tableRowLength = table[0].length;
        let currentFigureLength = figure[rotation][0].length;
        return tableRowLength - (colPosition + currentFigureLength);
    }

    getFigureRotatePosition = (rotation) => {
        const { position: [rowPosition, colPosition]} = this.state;
        let figureOutsideSpace = this.getFigureOutsideSpace(rotation);
        //let [rowPosition, colPosition] = this.getFigureIPosition(rotation);
        return figureOutsideSpace < 0 ? [rowPosition, colPosition+figureOutsideSpace] : [rowPosition, colPosition];
    }

    // getFigureIPosition = (rotation) => {
    //     const { figure, position: [rowPosition, colPosition] } = this.state;
    //     if(isEqual(figure, FIGURES['I'])) {
    //         if(rotation === 'left' || rotation === 'right') {
    //             return [rowPosition, colPosition-2];
    //         } else {
    //             return [rowPosition, colPosition+2];
    //         }
    //     }
    //     return [rowPosition, colPosition];
    // }

    handleKeyPress = (e) => {
        const code = e.code;
        const {position: [rowPosition, colPosition], rotation, table, figure} = this.state;
        switch(code) {
            case 'ArrowUp':
                let rotationNext = this.getNextRotationPosition(rotation);
                this.setState(() => ({
                    position: this.getFigureRotatePosition(rotationNext),
                    rotation: rotationNext,
                }));
                break;
            case 'ArrowDown':
                let rotationPrev = this.getPrevRotationPosition(rotation);
                this.setState(() => ({
                    position: this.getFigureRotatePosition(rotationPrev),
                    rotation: rotationPrev,
                }));
                break;
            case 'ArrowLeft':
                if(this.isFigureCloseToLeft()) {
                    this.setState(() => ({
                        position: [rowPosition, colPosition-1],
                    }));
                }
                break;
            case 'ArrowRight':
                if(this.isFigureCloseToRight(rotation)) {
                    this.setState(() => ({
                        position: [rowPosition, colPosition+1],
                    }));
                }
                break;
            case 'Space':
                this.setState(() => ({
                    position: [rowPosition+1, colPosition],
                }));
                break;
        }
    }

    render() {
        const { classes } = this.props;
        const { table, figure, rotation, position } = this.state;
        let tableGrid = this.mergeFigure(figure[rotation], table, position);
        console.log(position);
        return (
            <Provider store={store}>
                <Box
                    className={classes.tetris}
                >
                    <Grid
                        table={tableGrid}
                    />
                </Box>
            </Provider>
        );
    }
};

export default withStyles(styles)(Tetris);