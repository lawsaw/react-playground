import React, { PureComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

class Bar extends PureComponent {

    render() {
        const { gameMode, onGameModeChange } = this.props;
        return (
            <AppBar position="static">
                <Toolbar>
                    <Button
                        variant="contained"
                        onClick={() => onGameModeChange('single')}
                        disabled={gameMode === 'single'}
                        color="secondary"
                    >
                        SinglePlayer
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => onGameModeChange('multi')}
                        disabled={gameMode === 'multi'}
                        color="secondary"
                    >
                        MultiPlayer
                    </Button>
                </Toolbar>
            </AppBar>
        );
    }

};

export default Bar;