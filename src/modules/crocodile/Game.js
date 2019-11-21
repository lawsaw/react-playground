import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button, Dialog } from "@material-ui/core";
import { Chat, Paint, Screen, GamePainter, GameWatcher, ButtonBar, PlayersBar, RoomInfoBar, Winner } from "./";
import { ROOM_STATUS_PAINTER_SELECTING, ROOM_STATUS_WAITING } from './constants';

const styles = (theme) => ({
    crocodile: {
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    paint: {},
    chat: {
        flexGrow: 1,
    },
    players: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
});

class Game extends PureComponent {

    generateStatus = () => {
        const { room: { status, countdown, players } } = this.props;
        let newStatus;
        switch (status) {
            case ROOM_STATUS_PAINTER_SELECTING:
                newStatus =  `Game will start in ${countdown}`;
                break;
            default:
                newStatus = status;
                break;
        }
        return newStatus;
    }

    render() {
        const { classes, onChat, room, user, onRoomLeave, onGamePreStart, task, children, chat } = this.props;
        let { winner } = room;
        let status = this.generateStatus();
        console.log(room, user);
        return (
            <Fragment>
                <RoomInfoBar
                    data={[
                        {
                            label: 'Room name',
                            value: room.roomName,
                        },
                        {
                            label: 'Room status',
                            value: status,
                        },
                        {...task},
                        {
                            label: 'Current players',
                            value:  <PlayersBar
                                        players={room.players}
                                    />
                        },
                    ]}
                />
                <Grid
                    container
                    spacing={1}
                    wrap="nowrap"
                    className={classes.crocodile}
                >
                    <Grid
                        item
                        className={classes.paint}
                    >
                        {children}
                    </Grid>
                    <Grid
                        item
                        className={classes.chat}
                    >
                        <Chat
                            room={room}
                            onChat={onChat}
                            chat={chat}
                        />
                    </Grid>
                </Grid>
                <ButtonBar
                    onGamePreStart={onGamePreStart}
                    onRoomLeave={onRoomLeave}
                />
                <Winner
                    winner={winner}
                    word={room.word}
                />
            </Fragment>
        )
    }
}

export default withStyles(styles)(Game);