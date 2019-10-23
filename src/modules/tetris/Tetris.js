import React, { PureComponent } from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Body, Multi } from './';
import {COL_SIZE, COLS, ROWS, ROWS_HIDDEN} from "./constants";

const styles = () => ({

});

class Tetris extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            gameMode: 'multi',
        }
    }

    onGameModeChange = (gameMode) => {
        this.setState(() => ({
            gameMode,
        }))
    }

    render() {
        const { gameMode } = this.state;
        return (
            <Provider store={store}>
                <SnackbarProvider maxSnack={3} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Button
                                variant="contained"
                                onClick={() => this.onGameModeChange('single')}
                                disabled={gameMode === 'single'}
                                color="secondary"
                            >
                                SinglePlayer
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => this.onGameModeChange('multi')}
                                disabled={gameMode === 'multi'}
                                color="secondary"
                            >
                                MultiPlayer
                            </Button>
                        </Toolbar>
                    </AppBar>

                    {
                        gameMode === 'single' ? (
                            <Body />
                        ) : (
                            <Multi />
                        )
                    }

                </SnackbarProvider>
            </Provider>
        );
    }

};


export default withStyles(styles)(Tetris);