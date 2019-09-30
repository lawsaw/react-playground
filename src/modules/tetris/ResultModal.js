import React from 'react';
import { withStyles } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const styles = () => ({

});

export default withStyles(styles)(({ isOpen, onClose, score }) => {

    return (
        <Dialog onClose={onClose} open={isOpen}>
            <DialogTitle>Your score is {score}</DialogTitle>
            <DialogActions>
                <Button  color="primary" variant="contained" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );

});