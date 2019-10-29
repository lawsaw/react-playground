import React, { Fragment, PureComponent } from 'react';
import { cloneDeep } from 'lodash';
import { withSnackbar } from 'notistack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GridMaterial from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { ResultModal, Score, Screen, Preview } from './';
import { FIGURES, ROTATION_CIRCLE, ROWS, COLS, POSITION, ROWS_HIDDEN, SPEED, SPEED_STEP, SPEED_RAISE_FOR_SCORE } from './constants';
import { generateGrid, merge, renderDemoHouse } from './etc';

const styles = () => ({

});

class Body extends PureComponent {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            table: renderDemoHouse(generateGrid(COLS, ROWS)),
            rotation: this.getRandomRotation(),
            rotationNext: this.getRandomRotation(),
            figure: this.getRandomFigure(),
            figureNext: this.getRandomFigure(),
            position: POSITION,
            speed: SPEED,
            score: 0,
            isPause: true,
            isGameRunning: false,
            isResultModalOpen: false,
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
        if(this.props.onGameOnline) {
            this.setOnlineCallbacks();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    setOnlineCallbacks = () => {
        const { handleStartNewGameCallback, handlePauseCallback, handleContinueCallback, handleEndGameCallback } = this.props;
        handleStartNewGameCallback(isActioned => this.handleStartNewGame(isActioned));
        handlePauseCallback(isActioned => this.handlePause(isActioned));
        handleContinueCallback(isActioned => this.handleContinue(isActioned));
        handleEndGameCallback(isActioned => this.handleEndGame(isActioned));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.onGameOnline) {
            if(this.props.user.speed && (this.props.user.speed < this.state.speed)) {
                this.setState(() => ({
                    speed: this.props.user.speed,
                }));
                this.props.enqueueSnackbar(`${this.props.user.opponent.nickname} has increased your speed. It's now ${this.props.user.speed}ms!`, {
                    variant: 'info',
                    autoHideDuration: 1500,
                });
            }
        }
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
        }, speed);
    }

    resetSpeed = () => {
        clearInterval(this.timer);
        this.startGame();
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
        const { position, table, figure } = this.state;
        const colPosition = position[1];
        let tableRowLength = table[0].length;
        let currentFigureLength = figure[rotation][0].length;
        return tableRowLength - (colPosition + currentFigureLength);
    }

    getFigureRotatePosition = (rotation) => {
        const { position: [rowPosition, colPosition]} = this.state;
        let figureOutsideSpace = this.getFigureOutsideSpace(rotation);
        return figureOutsideSpace < 0 ? [rowPosition, colPosition+figureOutsideSpace] : [rowPosition, colPosition];
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
            default:
                break;
        }
        return [rowNew, colNew];
    }

    moveFigure = (moveDirection) => {
        const { onGameOnline } = this.props;
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
                this.handleEndGame(typeof onGameOnline !== 'undefined');
            }
        }
    }

    isEndGame = () => {
        const { table } = this.state;
        let checkedRow = table[ROWS_HIDDEN-1];
        return checkedRow.find(col => col === 1);
    }

    handleEndGame = (isActioned) => {
        if(isActioned) {
            const { onGameOnline } = this.props;
            if(onGameOnline) onGameOnline({action: 'handleEndGame'});
        }
        clearInterval(this.timer);
        this.handleResultModalOpen();
        this.setState(() => ({
            isGameRunning: false,
            speed: SPEED,
        }));
    }

    handleEndGameOnline = () => {
        this.handleEndGame(true);
    }

    handleResultModalOpen = () => {
        this.setState(() => ({
            isResultModalOpen: true,
        }));
    }

    handleResultModalClose = (action) => {
        const { onBackToLobby } = this.props;
        this.setState(() => ({
            isResultModalOpen: false,
        }));
        if(onBackToLobby && action === 'lobby') {
            onBackToLobby();
        }
    }

    handleStartNewGame = (isActioned) => {
        if(isActioned) {
            const { onGameOnline } = this.props;
            if(onGameOnline) onGameOnline({action: 'handleStartNewGame'});
        }
        this.setState(() => ({
            isResultModalOpen: false,
            table: generateGrid(COLS, ROWS),
            figure: this.getRandomFigure(),
            figureNext: this.getRandomFigure(),
            position: POSITION,
            rotation: this.getRandomRotation(),
            rotationNext: this.getRandomRotation(),
            score: 0,
            isPause: false,
            isGameRunning: true,
            speed: SPEED,
        }));
        this.startGame();
    }

    handleStartNewGameOnline = () => {
        this.handleStartNewGame(true);
    }

    // handleStartNewOnlineGame = () => {
    //     const { onGameReset } = this.props;
    //     if(onGameReset) {
    //         this.handleStartNewGame();
    //         onGameReset();
    //     }
    // }

    handleLastStepDown = () => {
        const { onGameOnline } = this.props;
        const { figure, rotation, table, position, figureNext, rotationNext, score, speed } = this.state;
        //const speed = onGameOnline ? this.props.user.speed : this.state.speed;
        let tableWithFigure = merge(figure[rotation], table, position);
        let fullRows = this.getAllFullRowsIndexes(tableWithFigure);
        let scoreNew = score + fullRows.length;
        let speedNew = speed;
        if(fullRows.length) {
            tableWithFigure = this.cleanTableFromFullRows(tableWithFigure, fullRows);
            speedNew = this.getScoreOptimalSpeed(scoreNew);
        }
        this.setState(() => ({
            table: tableWithFigure,
            figure: figureNext,
            figureNext: this.getRandomFigure(),
            position: POSITION,
            rotation: rotationNext,
            rotationNext: this.getRandomRotation(),
            score: scoreNew,
            speed: onGameOnline ? speed : speedNew, //TODO: increase speed yourself in single game, but increase speed of ypu opponent oin online game
        }));

        if(onGameOnline) {
            onGameOnline({
                score: scoreNew,
                speed: speedNew,
            });
        }

        this.resetSpeed();
    }

    getScoreOptimalSpeed = (score) => {
        const { onGameOnline } = this.props;
        let speed = this.state.speed;
        for(let i = 1; i < speed; i++) if(score >= SPEED_RAISE_FOR_SCORE*i && score < SPEED_RAISE_FOR_SCORE*i+SPEED_RAISE_FOR_SCORE && speed !== SPEED-i*SPEED_STEP) {
            speed -= SPEED_STEP;
            this.props.enqueueSnackbar(!onGameOnline ? `Speed is now ${speed}ms!` : `You made ${this.props.user.opponent.nickname}'s speed ${speed}ms!`, {
                variant: 'info',
                autoHideDuration: 1500,
            });
        }
        return speed;
    }

    cleanTableFromFullRows = (table, fullRows) => {
        let cleanRow = Array.from({ length: COLS }, () => 0);
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
        let figureSquare = Array.from({ length: size }, () => Array.from({ length: size }, () => 1));
        return this.getFigureMap(figureSquare, null, position);
    }

    handleKeyPress = (e) => {
        const code = e.code;
        const { rotation, isPause, isGameRunning } = this.state;
        if(!isPause || !isGameRunning) {
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
                default:
                    break;
            }
        }
    }

    getFigureMap = (figure, moveDirection, position) => {
        let cleanGrid = generateGrid(COLS, ROWS);
        return merge(figure, cleanGrid, position);
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
        const { table } = this.state;
        if(!this.isPositionInArea(rotation, position)) return false;
        //let figureMap = this.getFigureMap(figure[rotation], null, position);
        let figureMap = this.getFigureFullGrid();
        return this.hasTablesConflict(table, figureMap);
    }

    getAllFullRowsIndexes = (table) => {
        return table.reduce(function(a, row, i) {
            let isRowFull = row.reduce((a, col) => a + col) === COLS;
            if(isRowFull) a.push(i);
            return a;
        }, []);
    }

    isPositionInArea = (rotation, [row, col]) => {
        const { figure } = this.state;
        let rowLimit = row + figure[rotation].length;
        let colLimit = col + figure[rotation][0].length;
        return rowLimit <= ROWS && colLimit <= COLS;
    }

    // handleResultModal = () => {
    //     this.setState(() => ({
    //         isResultModalOpen: !this.state.isResultModalOpen,
    //     }))
    // }

    handlePause = (isActioned) => {
        if(isActioned) {
            const { onGameOnline } = this.props;
            if(onGameOnline) onGameOnline({action: 'handlePause'});
        }
        this.setState(() => ({
            isPause: true,
        }));
        clearInterval(this.timer);
    }

    handlePauseOnline = () => {
        this.handlePause(true);
    }

    handleContinue = (isActioned) => {
        if(isActioned) {
            const { onGameOnline } = this.props;
            if(onGameOnline) onGameOnline({action: 'handleContinue'});
        }
        this.setState(() => ({
            isPause: false,
        }));
        this.startGame();
    }

    handleContinueOnline = () => {
        this.handleContinue(true);
    }

    render() {
        const { onGameOnline, user } = this.props;
        const { table, figure, rotation, position, figureNext, rotationNext, score, isPause, isResultModalOpen, isGameRunning } = this.state;
        let tableWithFigure = figure ? merge(figure[rotation], table, position) : table;

        return (
            <Fragment>
                <GridMaterial container justify="center" spacing={5}>
                    <GridMaterial item>
                        <Screen
                            table={tableWithFigure}
                            onGameOnline={onGameOnline}
                        />
                    </GridMaterial>
                    <GridMaterial item>
                        {
                            (isGameRunning || onGameOnline) && (
                                <Preview
                                    table={figureNext[rotationNext]}
                                    onGameOnline={onGameOnline}
                                />
                            )
                        }
                        <Score
                            value={score}
                        />
                        <List>
                            {
                                !isGameRunning && (
                                    <ListItem>
                                        <Button color="primary" variant="contained" onClick={isGameRunning ? this.handleStartNewGameOnline : this.handleStartNewGame}>
                                            Start New Game
                                        </Button>
                                    </ListItem>
                                )
                            }
                            {
                                isGameRunning && !isPause && (
                                    <ListItem>
                                        <Button color="secondary" variant="contained" onClick={isGameRunning ? this.handlePauseOnline : this.handlePause}>
                                            Pause
                                        </Button>
                                    </ListItem>
                                )
                            }
                            {
                                isGameRunning && isPause && (
                                    <ListItem>
                                        <Button color="secondary" variant="contained" onClick={isGameRunning ? this.handleContinueOnline : this.handleContinue}>
                                            Continue
                                        </Button>
                                    </ListItem>
                                )
                            }
                            {
                                isGameRunning && (
                                    <ListItem>
                                        <Button color="primary" variant="contained" onClick={isGameRunning ? this.handleEndGameOnline : this.handleEndGame}>
                                            Stop Game
                                        </Button>
                                    </ListItem>
                                )
                            }
                        </List>
                    </GridMaterial>
                </GridMaterial>
                <ResultModal
                    isOpen={isResultModalOpen}
                    onClose={this.handleResultModalClose}
                    user={user}
                    score={score}
                />
            </Fragment>
        );
    }
};

export default withSnackbar(withStyles(styles)(Body));