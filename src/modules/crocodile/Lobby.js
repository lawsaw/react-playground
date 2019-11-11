import React, { PureComponent, Fragment } from 'react';
import { withStyles, Paper, IconButton, InputBase, Box, List, ListItem, ListItemText, Divider, Grid, Dialog } from "@material-ui/core";
import { Send, Add } from '@material-ui/icons';
import { TextInput } from './';
import { LOBBY_STEPS, LOBBY_STEP_NICKAME_CHANGING, LOBBY_STEP_ROOM_SELECTING, LOBBY_STEP_WORD_SELECTING } from './constants';

const styles = (theme) => ({
    lobby: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: theme.palette.green[100],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lobbyContent: {
        position: 'relative',
    },
    root: {

    },
    form: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 250,
    },
    input: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    iconButton: {
        padding: 20,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    stepTitle: {
        fontSize: theme.typography.pxToRem(30),
        margin: '20px 0',
    },
    list: {
        width: 350,
    },

});

class Lobby extends PureComponent {

    constructor(props) {
        super(props);
    }

    renderRoomSelect = () => {
        const { classes, roomList, onNewRoomSubmit, onRoomSelect, newRoomName, onNewRoomCreateModalOpen, onNewRoomCreateModalClose, onNewRoomNameChange, isNewRoomCreateModal } = this.props;
        return (
            <Fragment>
                <Box className={classes.stepTitle} >Select room or create new one: </Box>
                <Grid
                    container
                >
                    <Grid
                        item
                    >
                        <IconButton
                            className={classes.iconButton}
                            onClick={onNewRoomCreateModalOpen}
                        >
                            <Add />
                        </IconButton>
                    </Grid>
                    <Grid
                        item
                    >
                        <Paper>
                            <List component="nav" className={classes.list}>
                                {
                                    roomList.length ? roomList.map(({ room, players }, index) => {
                                        return (
                                            <Fragment
                                                key={room}
                                            >
                                                <ListItem
                                                    button
                                                    onClick={() => onRoomSelect(room)}
                                                >
                                                    <ListItemText primary={room} />
                                                    <Box>({players})</Box>
                                                </ListItem>
                                                {
                                                    index !== (roomList.length - 1) ? <Divider /> : null
                                                }
                                            </Fragment>
                                        )
                                    }) : 'No rooms found'
                                }
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog
                    open={isNewRoomCreateModal}
                    onClose={onNewRoomCreateModalClose}
                >
                    <TextInput
                        onChange={onNewRoomNameChange}
                        onSubmit={onNewRoomSubmit}
                        placeholder="Enter new room name"
                        value={newRoomName}
                    />
                </Dialog>
            </Fragment>
        )
    }

    renderStep = (step) => {
        const { onNicknameChange, onNicknameSubmit, user } = this.props;
        let Page = null;
        switch (step) {
            case LOBBY_STEP_NICKAME_CHANGING:
                Page =  <TextInput
                            onChange={onNicknameChange}
                            onSubmit={onNicknameSubmit}
                            placeholder="Enter your nickname"
                            value={user.nickname || ''}
                        />
                break;
            case LOBBY_STEP_ROOM_SELECTING:
                Page = this.renderRoomSelect();
                break;
            default:
                break;
        }
        return Page;
    }

    render() {
        const { classes, lobbyStep } = this.props;
        const Step = this.renderStep(lobbyStep);
        return (
            <Box
                className={classes.lobby}
            >
                <Box
                    className={classes.lobbyContent}
                >
                    {Step}
                </Box>
            </Box>
        )
    }
}

export default withStyles(styles)(Lobby);