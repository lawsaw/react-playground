import React, {PureComponent } from 'react';
import { withStyles, Box, Dialog, DialogTitle, Table, TableHead, TableCell, TableRow } from "@material-ui/core";

const styles = () => ({
    table: {
        width: 300,
    },
});

class Winner extends PureComponent {

    render() {
        const { classes, winner, word } = this.props;
        let { id, nickname } = winner || {};
        return id ? (
            <Dialog
                open={true}
            >
                <DialogTitle>
                    <Box>
                        <Box component="h4">
                           The game is over!
                        </Box>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Winner: </TableCell>
                                    <TableCell align="right">{nickname}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Right word: </TableCell>
                                    <TableCell align="right">{word}</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </Box>
                </DialogTitle>
            </Dialog>
        ) : null;
    }
}

export default withStyles(styles)(Winner);