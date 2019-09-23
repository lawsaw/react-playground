import React, { Component } from 'react';
import Box from "@material-ui/core/Box";
import { withStyles } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from "./redux/store";
import MaterialButton from '@material-ui/core/Button';

const StyledMaterialButton = withStyles(theme => ({
    root: {
        padding: 3,
        minWidth: 'auto',
        '& svg': {
            fontSize: theme.typography.pxToRem(16),
        },
    },
}))(MaterialButton);

const styles = () => ({
    tetris: {
        position: 'relative',
    }
});

class Tetris extends Component {

    componentDidMount() {
        document.addEventListener('keydown', (event) => {
            const code = event.code;
            console.log(code);
            //console.log('keypress event\n\n' + 'key: ' + keyName);
        });
    }

    generateGrid = (hor, ver) => {
        return Array.from({length: ver}, () => Array.from({length: hor}, () => 0));
    }

    render() {
        const { classes } = this.props;
        let data = this.generateGrid(5, 10);
        console.log(data);
        return (
            <Provider store={store}>
                <Box
                    className={classes.tetris}
                >
                    tetris
                </Box>
            </Provider>
        );
    }

};

export default withStyles(styles)(Tetris);