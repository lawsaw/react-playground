import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import Box from "@material-ui/core/Box";
import GridMaterial from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { Grid } from './';
import { FIGURES, ROTATION_CIRCLE, ROWS, COLS, POSITION, COL_SIZE, ROWS_HIDDEN } from './constants';

const styles = () => ({
    screen: {
        position: 'relative',
        width: COL_SIZE*COLS,
        height: COL_SIZE*(ROWS-ROWS_HIDDEN),
    },
    screenInner: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    preview: {
        width: COL_SIZE*4,
        height: COL_SIZE*4,
    },
    points: {
        fontSize: 40,
    },
});

class Tetris extends Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            table: this.renderDemoHouse(this.generateGrid(COLS, ROWS)),
            rotation: this.getRandomRotation(),
            rotationNext: this.getRandomRotation(),
            figure: this.getRandomFigure(),
            figureNext: this.getRandomFigure(),
            position: POSITION,
            speed: 200,
            points: 0,
            isPause: true,
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    getRandomFigure = () => {
        let figures = Object.keys(FIGURES);
        let figure = Math.ceil(Math.random() * (figures.length-1));
        return FIGURES[figures[figure]];
    }

    getRandomRotation = () => {
        let rotation = Math.ceil(Math.random() * (ROTATION_CIRCLE.length-1));
        return ROTATION_CIRCLE[rotation];
    }

    startGame = () => {
        const { speed } = this.state;
        this.timer = setInterval(() => {
            this.moveFigure('down');
            //this.startGame();
        }, speed);
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
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,0,0],
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
        if(this.hasFigureRightToMove(moveDirection, position)) {
            this.setState(() => ({
                position,
            }));
        }
        if(moveDirection === 'down' && !this.hasFigureRightToMove('down', position)) {
            if(!this.isEndGame()) {
                this.handleLastStepDown();
            } else {
                this.handleEndGame();
            }
        }
    }

    isEndGame = () => {
        const { table } = this.state;
        let checkedRow = table[ROWS_HIDDEN-1];
        return checkedRow.find(col => col === 1);
    }

    handleEndGame = () => {
        const { points } = this.state;
        //clearTimeout(this.timer);
        clearInterval(this.timer);
        this.setState(() => ({
            isPause: true,
        }));
        alert(`You lost. You score is ${points}`);
    }

    handleResetGame = () => {
        this.setState(() => ({
            table: this.generateGrid(COLS, ROWS),
            figure: this.getRandomFigure(),
            figureNext: this.getRandomFigure(),
            position: POSITION,
            rotation: this.getRandomRotation(),
            rotationNext: this.getRandomRotation(),
            points: 0,
            isPause: false,
        }));
        this.startGame();
    }

    handleLastStepDown = () => {
        const { figure, rotation, table, position, figureNext, rotationNext, points } = this.state;
        let tableWithFigure = this.merge(figure[rotation], table, position);
        let fullRows = this.getAllFullRowsIndexes(tableWithFigure);
        if(fullRows.length) {
            tableWithFigure = this.cleanTableFromFullRows(tableWithFigure, fullRows);
        }
        this.setState(() => ({
            table: tableWithFigure,
            figure: figureNext,
            figureNext: this.getRandomFigure(),
            position: POSITION,
            rotation: rotationNext,
            rotationNext: this.getRandomRotation(),
            points: points + fullRows.length,
        }));
    }

    cleanTableFromFullRows = (table, fullRows) => {
        let cleanRow = Array.from({length: COLS}, () => 0);
        let newTable = cloneDeep(table);
        fullRows.forEach((rowToClean, rowToCleanIndex, arr) => {
            let top = newTable.slice(0, rowToClean);
            let bottom = newTable.slice(arr[rowToCleanIndex]+1, newTable.length);
            newTable = [cleanRow, ...top, ...bottom];
        })
        return newTable;
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
                this.rotateFigure(this.getPrevRotationPosition);
                break;
            case 'ArrowDown':
                this.rotateFigure(this.getNextRotationPosition);
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
        const { table, figure, rotation, position, figureNext, rotationNext, points, isPause } = this.state;
        let tableWithFigure = figure ? this.merge(figure[rotation], table, position) : table;
        return (
            <Provider store={store}>
                <GridMaterial container justify="center" spacing={5}>
                    <GridMaterial item>
                        <Box
                            className={classes.screen}
                        >
                            <Box
                                className={classes.screenInner}
                            >
                                <Grid
                                    table={tableWithFigure}
                                />
                            </Box>
                        </Box>
                    </GridMaterial>
                    <GridMaterial item>
                        {
                            !isPause && (
                                <Box
                                    className={classes.preview}
                                >
                                    <Grid
                                        table={figureNext[rotationNext]}
                                        isPreview
                                    />
                                </Box>
                            )
                        }
                        <Box
                            className={classes.points}
                        >
                            Score: {points}
                        </Box>
                        {
                            isPause && (
                                <Button color="secondary" onClick={this.handleResetGame}>
                                    Start New Game
                                </Button>
                            )
                        }
                    </GridMaterial>
                </GridMaterial>

            </Provider>
        );
    }
};

export default withStyles(styles)(Tetris);