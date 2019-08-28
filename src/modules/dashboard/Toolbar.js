import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
//import { lighten } from '@material-ui/core/styles/colorManipulator';
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

export default withStyles(styles)(({ classes, id, idUnic, addSection, deleteSection }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function createNewWin(callback, nType) {
        callback(id, idUnic, nType);
        setAnchorEl(null);
    }

    function deleteWin(callback) {
        callback(id, idUnic);
        setAnchorEl(null);
    }

    return (
        <Box
            className={classes.toolbar}
        >
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
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