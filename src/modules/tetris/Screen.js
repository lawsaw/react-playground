import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import { ROWS, COLS, COL_SIZE, ROWS_HIDDEN } from './constants';
import {Grid} from "./index";

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
});

class Screen extends PureComponent {

    render() {
        const { classes, table, server } = this.props;
        return (
            <Box
                className={classes.screen}
            >
                <Box
                    className={classes.screenInner}
                >
                    <Grid
                        table={table}
                        server={server}
                    />
                </Box>
            </Box>
        );
    }

};


export default withStyles(styles)(Screen);