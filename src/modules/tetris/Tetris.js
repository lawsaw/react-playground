import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import Box from "@material-ui/core/Box";
import { withStyles } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { Grid } from './';
import { FIGURES, ROTATION_CIRCLE } from './constants';

const styles = () => ({
    tetris: {
        position: 'relative',
    }
});

class Tetris extends Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            table: this.renderDemoHouse(this.generateGrid(10, 20)),
            rotation: 'left',
            figure: FIGURES['L'],
            position: [10,4],
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
        let table = cloneDeep(grid);
        return table.map((row, rowIndex) => {
            if(rowIndex === rowPosition) {
                figure.forEach((figureRow, figureRowIndex) => {
                    let replacement = table[rowIndex + figureRowIndex].splice(colPosition, figureRow.length, ...figureRow);
                    replacement.forEach((replacementItem, replacementIndex) => {
                        if(replacementItem !== 0) {
                            let tableRowTarget = rowIndex + figureRowIndex;
                            table[tableRowTarget][colPosition+replacementIndex] = 1;
                        }
                    })
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
        return figureOutsideSpace < 0 ? [rowPosition, colPosition+figureOutsideSpace] : [rowPosition, colPosition];
    }

    renderDemoHouse = (table) => {
        let house = [
            [1,0,0,0,0,1,0,0,0,0],
            [1,1,0,0,0,1,0,1,0,1],
            [1,1,1,1,0,1,0,1,1,1],
            [1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1]
        ];
        let newGrid = this.mergeFigure(house, table, [table.length-house.length, 0]);
        return newGrid;
    }

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
                if(this.isFigureCloseToLeft() && this.hasFigureRightToMove(true)) {
                    this.setState(() => ({
                        position: [rowPosition, colPosition-1],
                    }));
                }
                break;
            case 'ArrowRight':
                if(this.isFigureCloseToRight(rotation) && this.hasFigureRightToMove(true)) {
                    this.setState(() => ({
                        position: [rowPosition, colPosition+1],
                    }));
                }
                break;
            case 'Space':
                this.makeStepDown();
                break;
        }
    }

    makeStepDown = () => {
        const { position: [rowPosition, colPosition] } = this.state;
        let rightToMove = this.hasFigureRightToMove();
        if(rightToMove) {
            let rowPositionNext = rowPosition+1;
            this.setState(() => ({
                position: [rowPositionNext, colPosition],
            }));
        }
    }

    getFigureMap = () => {
        const { position: [rowPosition, colPosition], rotation, figure } = this.state;
        let cleanGrid = this.generateGrid(10, 20);
        return this.mergeFigure(figure[rotation], cleanGrid, [rowPosition+1, colPosition]);
    }

    hasFigureRightToMove = (isNext) => {
        const { table } = this.state;
        let figureMap = this.getFigureMap();
        let current = isNext;
        return !table.find((tableRow, tableRowIndex) => tableRow.find((tableCol, tableColIndex) => tableCol === figureMap[tableRowIndex][tableColIndex] && tableCol === 1));
    }

    render() {
        const { classes } = this.props;
        const { table, figure, rotation, position } = this.state;
        let gridWithFigure = this.mergeFigure(figure[rotation], table, position);
        return (
            <Provider store={store}>
                <Box
                    className={classes.tetris}
                >
                    <Grid
                        table={gridWithFigure}
                    />
                </Box>
            </Provider>
        );
    }
};

export default withStyles(styles)(Tetris);