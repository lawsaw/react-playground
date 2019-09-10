import React from 'react';
import Box from "@material-ui/core/Box";
import { withStyles } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { lighten } from "@material-ui/core/styles";
import { Grid } from './';
import { INIT_DATA } from "./constants";

const styles = (theme) => ({
    dashboard: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: 10 + 16,
        bottom: 10,
        backgroundColor: lighten(theme.palette.grey[500], 0.8),
    },
});

export default withStyles(styles)(({ classes }) => {

    return (
        <Provider store={store}>
            <Box
                className={classes.dashboard}
            >
                <Grid {...INIT_DATA} />
            </Box>
        </Provider>
    );

});