import React, { PureComponent } from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { withStyles } from '@material-ui/core';
import GridMaterial from '@material-ui/core/Grid';
import { Body, Multi, Bar } from './';

const styles = () => ({
    wrap: {
        height: '100%',
    },
    wrapHeader: {
        flexShrink: 0,
    },
    wrapWork: {
        flexGrow: 1,
    },
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
        const { classes } = this.props;
        const { gameMode } = this.state;
        return (
            <Provider store={store}>
                <SnackbarProvider maxSnack={3} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                    <GridMaterial
                        container
                        direction="column"
                        className={classes.wrap}
                    >
                        <GridMaterial
                            item
                            className={classes.wrapHeader}
                        >
                            <Bar
                                gameMode={gameMode}
                                onGameModeChange={this.onGameModeChange}
                            />
                        </GridMaterial>
                        <GridMaterial
                            item
                            container
                            justify="center"
                            alignItems="center"
                            className={classes.wrapWork}
                        >
                            {
                                gameMode === 'single' ? (
                                    <Body />
                                ) : (
                                    <Multi />
                                )
                            }
                        </GridMaterial>
                    </GridMaterial>
                </SnackbarProvider>
            </Provider>
        );
    }

};


export default withStyles(styles)(Tetris);