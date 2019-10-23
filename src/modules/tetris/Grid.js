import React, { Component } from 'react';
import cx from 'classnames';
import { isEqual } from 'lodash';
import { withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
//import {F} from "../dashboard";
import { ROWS_HIDDEN, COL_SIZE } from './constants';

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
        width: COL_SIZE,
        height: COL_SIZE,
        margin: 0,
        border: '1px solid lightgrey',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        //transition: 'all 0.3s ease 0s',
    },
    square: {
        backgroundColor: 'grey',
    },
    hidden: {
        opacity: 0,
    },
});

class Grid extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(nextProps.table, this.props.table);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.server) {
            const { table } = this.props;
            const { master, friend, socket } = this.props.server;
            socket.emit('game', {
                friend,
                table
            });
        }
    }

    render() {
        const { classes, table, isPreview } = this.props;
        return (
            <Box
                className={classes.grid}
            >
                {
                    table.map((row, rowIndex) => {
                        return (
                            <Box
                                key={rowIndex}
                                className={cx(classes.row, !isPreview && (rowIndex < ROWS_HIDDEN) && classes.hidden)}
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