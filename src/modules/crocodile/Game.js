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

    // state = {
    //     isWinnerModal: false,
    // }
    //
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     const { winner } = this.props.room;
    //     if(winner) {
    //         this.setState(() => ({
    //             isWinnerModal: true,
    //         }))
    //     }
    // }



    render() {
        const { classes, onChat, room, user, onGameLeave, onGamePreStart, task, children } = this.props;
        //const { isWinnerModal } = this.state;
        let { winner } = room;
        let status = room.status === ROOM_STATUS_WAITING ?
                        Object.keys(room.players).length < 2 ?
                            `Waiting for more players` :
                            `Game will start in ${room.countdown}` :
                        room.status;
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
                        />
                    </Grid>
                </Grid>
                <ButtonBar
                    onGamePreStart={onGamePreStart}
                    onGameLeave={onGameLeave}
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