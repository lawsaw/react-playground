import React, { PureComponent, Fragment } from 'react';
import { withStyles, Paper, IconButton, InputBase, Box, List, ListItem, ListItemText, Divider, Grid, Dialog } from "@material-ui/core";
import { Send, Add } from '@material-ui/icons';
import { TextInput } from './';
import { LOBBY_STEPS, LOBBY_STEP_NICKAME_CHANGING, LOBBY_STEP_ROOM_SELECTING, LOBBY_STEP_WORD_SELECTING } from './constants';
import { preventMultipleSubmit } from "../../helpers/etc";

const styles = (theme) => ({
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
class LobbyRoomSelection extends PureComponent {

    constructor(props) {
        super(props);
        this.handleNewRoomSubmitDecorator = preventMultipleSubmit();
        this.state = {
            new_room_name: '',
            isNewRoomModal: false,
        }
    }
    
    

    handleNewRoomModalOpen = () => {
        this.setState(() => ({
            isNewRoomModal: true,
        }));
    }

    handleNewRoomModalClose = () => {
        this.setState(() => ({
            isNewRoomModal: false,
            new_room_name: '',
        }));
    }

    handleNewRoomChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            new_room_name: value,
        }));
    }

    handleNewRoomSubmit = () => {
        const { onNewRoomSubmit } = this.props;
        const { new_room_name } = this.state;
        this.handleNewRoomSubmitDecorator(() => onNewRoomSubmit(new_room_name));
    }
    
    render() {
        const { classes, rooms, onJoinRoom } = this.props;
        const { new_room_name, isNewRoomModal } = this.state;
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
                            onClick={this.handleNewRoomModalOpen}
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
                                    rooms && rooms.length ? rooms.map(({ room, players }, index) => {
                                        return (
                                            <Fragment
                                                key={room}
                                            >
                                                <ListItem
                                                    button
                                                    onClick={() => onJoinRoom(room)}
                                                >
                                                    <ListItemText primary={room} />
                                                    <Box>({players})</Box>
                                                </ListItem>
                                                {
                                                    index !== (rooms.length - 1) ? <Divider /> : null
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
                    open={isNewRoomModal}
                    onClose={this.handleNewRoomModalClose}
                >
                    <TextInput
                        onChange={this.handleNewRoomChange}
                        onSubmit={this.handleNewRoomSubmit}
                        placeholder="Enter new room name"
                        value={new_room_name}
                    />
                </Dialog>
            </Fragment>
        )
    }
}

export default withStyles(styles)(LobbyRoomSelection);