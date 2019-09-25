import React, { Component } from 'react';
import cx from 'classnames';
import { isEqual } from 'lodash';
import { withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
//import {F} from "../dashboard";

const styles = () => ({
    grid: {
        position: 'relative',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
    },
    col: {
        width: 30,
        height: 30,
        margin: 0,
        border: '1px solid lightgrey',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    square: {
        backgroundColor: 'lightgrey',
    }
});

class Grid extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(nextProps.table, this.props.table);
    }

    render() {
        const { classes, table } = this.props;
        //console.log(table);
        return (
            <Box
                className={classes.grid}
            >
                {
                    table.map((row, rowIndex) => {
                        return (
                            <Box
                                key={rowIndex}
                                className={classes.row}
                            >
                                {
                                    row.map((col, colIndex) => {
                                        return (
                                            <Box
                                                key={colIndex}
                                                className={cx(classes.col, col===1 && classes.square)}
                                            />
                                        )
                                    })
                                }
                            </Box>
                        )
                    })
                }
            </Box>
        );
    }
};

export default withStyles(styles)(Grid);