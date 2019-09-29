import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import Box from "@material-ui/core/Box";
import { withStyles } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { Grid } from './';
import { FIGURES, ROTATION_CIRCLE, ROWS, COLS } from './constants';

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
            table: this.renderDemoHouse(this.generateGrid(COLS, ROWS)),
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
            [1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1]
        ];
        let newGrid = this.merge(house, table, [table.length-house.length, 0]);
        return newGrid;
    }

    rotateFigure = (getRotationFunc) => {
        const { rotation: rotationCurrent } = this.state;
        let rotation = getRotationFunc(rotationCurrent);
        let position = this.getMoveStep(null, this.getFigureRotatePosition(rotation));
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
        const { position: positionCurrent } = this.state;
        let position = this.getMoveStep(moveDirection, positionCurrent);
        let isLastStepDown = this.isLastStepDown(position);
        if(this.hasFigureRightToMove(moveDirection, position)) {
            this.setState(() => ({
                position,
            }));
        } if(isLastStepDown) {
            this.handleLastStepDown();
        }
    }

    isLastStepDown = (pos) => {
        let position = this.getMoveStep('down', pos);
        return !this.hasFigureRightToMove('down', position)
    }

    handleLastStepDown = () => {
        const { figure, rotation, table, position } = this.state;
        let tableWithFigure = this.merge(figure[rotation], table, position);
        let fullRows = this.getAllFullRowsIndexes(tableWithFigure);
        if(fullRows.length) {
            tableWithFigure = this.cleanTableFromFullRows(tableWithFigure);
        }
        this.setState(() => ({
            table: tableWithFigure,
        }));
        console.log(fullRows);
    }

    cleanTableFromFullRows = (table) => {
        return table;
    }

    getFigureFullGrid = () => {
        const { figure, rotation, position } = this.state;
        let rows = figure[rotation].length;
        let cols = figure[rotation][0].length;
        let size = rows > cols ? rows : cols;
        let figureSquare = Array.from({length: size}, () => Array.from({length: size}, () => 1));
        return this.getFigureMap(figureSquare, null, position);
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

    getFigureMap = (figure, moveDirection, position) => {
        let cleanGrid = this.generateGrid(COLS, ROWS);
        return this.merge(figure, cleanGrid, position);
    }

    hasTablesConflict = (table1, table2) => {
        return !table1.find((tableRow, tableRowIndex) => tableRow.find((tableCol, tableColIndex) => tableCol === table2[tableRowIndex][tableColIndex] && tableCol === 1));
    }

    hasFigureRightToMove = (moveDirection, position) => {
        const { figure, table, rotation } = this.state;
        if(!this.isPositionInArea(rotation, position)) return false;
        let figureMap = this.getFigureMap(figure[rotation], moveDirection, position);
        return this.hasTablesConflict(table, figureMap);
    }

    hasFigureRightToRotate = (rotation, position) => {
        const { figure, table } = this.state;
        if(!this.isPositionInArea(rotation, position)) return false;
        console.log(position);
        let figureMap = this.getFigureMap(figure[rotation], null, position);
        let figureMap2 = this.getFigureFullGrid();
        return this.hasTablesConflict(table, figureMap2);
    }

    getAllFullRowsIndexes = (table) => {
        return table.reduce(function(a, row, i) {
            let isRowFull = row.reduce((a, col) => a + col) === COLS;
            if(isRowFull) a.push(i);
            return a;
        }, []);
    }

    isPositionInArea = (rotation, [row, col]) => {
        const { figure, position } = this.state;
        let rowLimit = row + figure[rotation].length;
        let colLimit = col + figure[rotation][0].length;
        return rowLimit <= ROWS && colLimit <= COLS;
    }


    render() {
        const { classes } = this.props;
        const { table, figure, rotation, position } = this.state;
        let tableWithFigure = this.merge(figure[rotation], table, position);
        //console.log(this.getAllFullRowsIndexes(gridWithFigure));
        //console.log(this.getFigureFullGrid());
        //console.log(table);
        return (
            <Provider store={store}>
                <Box
                    className={classes.tetris}
                >
                    <Grid
                        table={tableWithFigure}
                    />
                </Box>
            </Provider>
        );
    }
};

export default withStyles(styles)(Tetris);