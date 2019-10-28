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

    renderResultForSingle = () => {
        const { classes, score } = this.props;
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Your score is</TableCell>
                        <TableCell>{score}</TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        )
    }

    renderResultForOnline = () => {
        const { classes, score, user: { nickname, opponent: { score: opponentScore, nickname: opponentNickname } } } = this.props;
        return (
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
                        <TableCell>{score}</TableCell>
                        <TableCell align="right">{opponentScore}</TableCell>
                    </TableBody>
                </Table>
            </Box>
        )
    }

    renderButtonForOnline = () => {
        const { onClose, user: { opponent: { nickname: opponentNickname } } } = this.props;
        return (
            <Fragment>
                <Button  color="primary" variant="contained" onClick={() => onClose('newGame')}>
                    Start new game with {opponentNickname}
                </Button>
                <Button  color="primary" variant="contained" onClick={() => onClose('lobby')}>
                    Back to Lobby
                </Button>
            </Fragment>
        )
    }

    renderButtonForSingle = () => {
        const { onClose } = this.props;
        return (
            <Fragment>
                <Button  color="primary" variant="contained" onClick={onClose}>
                    Close
                </Button>
            </Fragment>
        )
    }

    render() {
        const { user, isOpen, onClose } = this.props;
        return (
            <Dialog onClose={onClose} open={isOpen}>
                <DialogTitle>
                    {
                        user ? this.renderResultForOnline() : this.renderResultForSingle()
                    }
                </DialogTitle>
                <DialogActions>
                    {
                        user ? this.renderButtonForOnline() : this.renderButtonForSingle()
                    }
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(ResultModal);
