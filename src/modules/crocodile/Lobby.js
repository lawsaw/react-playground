import React, { PureComponent, Fragment } from 'react';
import { withStyles, Paper, IconButton, InputBase, Box, List, ListItem, ListItemText, Divider, Grid, Dialog } from "@material-ui/core";
import { Send, Add } from '@material-ui/icons';
import { LobbyNickname, LobbyRoomSelection } from './';
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
});

class Lobby extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {
        const { classes, lobby_step, onNicknameSubmit, onNicknameChange, nickname, rooms, onNewRoomSubmit, onJoinRoom } = this.props;
        return (
            <Box
                className={classes.lobby}
            >
                <Box
                    className={classes.lobbyContent}
                >
                    {
                        lobby_step === 1 ? (
                            <LobbyNickname
                                onNicknameSubmit={onNicknameSubmit}
                                onNicknameChange={onNicknameChange}
                                nickname={nickname}
                            />
                        ) : lobby_step === 2 ? (
                            <LobbyRoomSelection
                                rooms={rooms}
                                onNewRoomSubmit={onNewRoomSubmit}
                                onJoinRoom={onJoinRoom}
                            />
                        ) : null
                    }
                </Box>
            </Box>
        )
    }
}

export default withStyles(styles)(Lobby);