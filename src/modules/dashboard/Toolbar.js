import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = () => ({
    toolbar: {
        position: 'relative',
        zIndex: 1,
    },
});

export default withStyles(styles)(({ classes, index, idCurrent, addSection, deleteSection }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function createNewWin(callback, nType) {
        callback(index, idCurrent, nType);
        setAnchorEl(null);
    }

    function deleteWin(callback) {
        callback(index, idCurrent);
        setAnchorEl(null);
    }

    return (
        <Box
            className={classes.toolbar}
        >
            <IconButton
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                keepMounted
            >
                <MenuItem onClick={() => createNewWin(addSection, 'col')}>
                    Col
                </MenuItem>
                <MenuItem onClick={() => createNewWin(addSection, 'row')}>
                    Row
                </MenuItem>
                <MenuItem onClick={() => deleteWin(deleteSection)}>
                    Delete
                </MenuItem>
            </Menu>
        </Box>
    );
});