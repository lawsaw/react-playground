import React, { useState } from 'react';
import { withStyles } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = () => ({

});

export default withStyles(styles)(({ classes, isOpen, onClose, add }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function handleChangeTitle(e) {
        let { value } = e.target;
        setTitle(value);
    }

    function handleChangeDescription(e) {
        let { value } = e.target;
        setDescription(value);
    }

    function handleAdd() {
        add({title, description});
        setTitle('');
        setDescription('');
        onClose();
    }

    return (
        <Dialog onClose={onClose} open={isOpen}>
            <DialogTitle id="simple-dialog-title">Adding new task</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={handleChangeTitle}
                />
            </DialogContent>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    value={description}
                    onChange={handleChangeDescription}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleAdd}>
                    Add
                </Button>
                <Button  color="primary" onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );

});