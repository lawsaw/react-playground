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
            figure: FIGURES['I'],
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

    merge = (figure, grid, [rowPosition, colPosition]) => {
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
            [1,1,1,1,1,1,0,1,1,1]
        ];
        let newGrid = this.merge(house, table, [table.length-house.length, 0]);
        return newGrid;
    }

    rotateFigure = (getRotationFunc) => {
        const { rotation: rotationCurrent } = this.state;
        let rotation = getRotationFunc(rotationCurrent);
        let position = this.getFigureRotatePosition(rotation);
        if(this.hasFigureRightToRotate(rotation, position)) {
            this.setState(() => ({
                position,
                rotation
            }));
        }
    }

    getMoveStep = (moveDirection, [row, col]) => {
        let [rowNew, colNew] = [row, col];
        switch(moveDirection) {
            case 'down':
                rowNew += 1;
                break;
            case 'left':
                colNew -= 1;
                break;
            case 'right':
                colNew += 1;
                break;
        }
        return [rowNew, colNew];
    }

    moveFigure = (moveDirection) => {
        const { position: [rowPosition, colPosition] } = this.state;
        let [row, col] = this.getMoveStep(moveDirection, [rowPosition, colPosition]);
        if(this.hasFigureRightToMove(moveDirection)) {
            this.setState(() => ({
                position: [row, col],
            }));
        }
    }

    handleKeyPress = (e) => {
        const code = e.code;
        const { rotation } = this.state;
        switch(code) {
            case 'ArrowUp':
                this.rotateFigure(this.getNextRotationPosition);
                break;
            case 'ArrowDown':
                this.rotateFigure(this.getPrevRotationPosition);
                break;
            case 'ArrowLeft':
                if(this.isFigureCloseToLeft(rotation)) {
                    this.moveFigure('left');
                }
                break;
            case 'ArrowRight':
                if(this.isFigureCloseToRight(rotation)) {
                    this.moveFigure('right');
                }
                break;
            case 'Space':
                this.moveFigure('down');
                break;
        }
    }

    getFigureMap = (moveDirection, rotationCustom, [rowPositionCustom, colPositionCustom]) => {
        const { position: [rowPosition, colPosition], rotation, figure } = this.state;
        let cleanGrid = this.generateGrid(10, 20);
        let [row, col] = this.getMoveStep(moveDirection, [rowPositionCustom || rowPosition, colPositionCustom || colPosition]);
        let rot = rotationCustom || rotation;
        return this.merge(figure[rot], cleanGrid, [row, col]);
    }

    hasTablesConflict = (table1, table2) => {
        return !table1.find((tableRow, tableRowIndex) => tableRow.find((tableCol, tableColIndex) => tableCol === table2[tableRowIndex][tableColIndex] && tableCol === 1));
    }

    hasFigureRightToMove = (moveDirection) => {
        const { table } = this.state;
        let figureMap = this.getFigureMap(moveDirection, null, []);
        return this.hasTablesConflict(table, figureMap);
    }

    hasFigureRightToRotate = (rot, pos) => {
        const { table } = this.state;
        let figureMap = this.getFigureMap(null, rot, pos);
        return this.hasTablesConflict(table, figureMap);
    }

    hasGridFullRow = (table) => {
        return table.filter(row => row.reduce((a, b) => a+b) === 10)
    }

    render() {
        const { classes } = this.props;
        const { table, figure, rotation, position } = this.state;
        let gridWithFigure = this.merge(figure[rotation], table, position);
        console.log(this.hasGridFullRow(gridWithFigure));
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