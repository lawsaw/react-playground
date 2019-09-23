import React from 'react';
import Box from "@material-ui/core/Box";
import { withStyles } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { Grid } from './';

const styles = () => ({
    todoList: {
        position: 'absolute',
        left: 0,
        top: 15,
        right: 0,
        bottom: 0,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
});

export default withStyles(styles)(({ classes }) => {

    return (
        <Provider store={store}>
            <Box
                className={classes.todoList}
            >
                <Grid />
            </Box>
        </Provider>
    );

});