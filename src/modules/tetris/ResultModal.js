import React, { PureComponent, Fragment } from 'react';
import { withStyles } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = () => ({
    table: {
        width: 300,
    },
});

class ResultModal extends PureComponent {

    renderResultSingle = () => {
        const { classes, score, onClose } = this.props;
        return (
            <Fragment>
                <DialogTitle>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Your score is</TableCell>
                                <TableCell>{score}</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </DialogTitle>
                <DialogActions>
                    <Button  color="primary" variant="contained" onClick={onClose}>
                        Close
                    </Button>
                </DialogActions>
            </Fragment>
        )
    }

    handleBack = (action) => {
        const { onClose } = this.props;
        return () => onClose(action);
    }

    renderResultOnline = () => {
        const { classes, score, user: { nickname, opponent: { score: opponentScore, nickname: opponentNickname } } } = this.props;
        return (
            <Fragment>
                <DialogTitle>
                    <Box>
                        <Box component="h4">
                            {
                                score < opponentScore ? (
                                    <Fragment>
                                        You lost!
                                    </Fragment>
                                ) : score > opponentScore ? (
                                    <Fragment>
                                        You won!
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        The friendship won!
                                    </Fragment>
                                )
                            }
                        </Box>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{nickname}</TableCell>
                                    <TableCell align="right">{opponentNickname}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{score}</TableCell>
                                    <TableCell align="right">{opponentScore}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </DialogTitle>
                <DialogActions>
                    <Button  color="primary" variant="contained" onClick={this.handleBack('replay')}>
                        Start new game with {opponentNickname}
                    </Button>
                    <Button  color="primary" variant="contained" onClick={this.handleBack('lobby')}>
                        Back to Lobby
                    </Button>
                </DialogActions>
            </Fragment>
        )
    }

    render() {
        const { user, isOpen, onClose } = this.props;
        return (
            <Dialog onClose={onClose} open={isOpen}>
                {
                    user ? this.renderResultOnline() : this.renderResultSingle()
                }
            </Dialog>
        );
    }
}

export default withStyles(styles)(ResultModal);