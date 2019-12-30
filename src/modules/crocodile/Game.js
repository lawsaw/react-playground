import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Button } from "@material-ui/core";
import { Chat, PlayersBar, RoomInfoBar, Winner } from "./";
import { ROOM_STATUS_WAITING, ROOM_STATUS_PAINTER_SELECTING, ROOM_STATUS_WORD_SELECTING, ROOM_STATUS_DRAWING, ROOM_STATUS_GAME_FINISHED } from './constants';

const styles = (theme) => ({
    crocodile: {
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    paint: {},
    chat: {
        flexGrow: 1,
        flexBasis: 200,
        flexShrink: 0,
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

const RoomName = ({ name, handleLeave }) => {
    return (
        <Fragment>
            {name}
            &nbsp;
            (
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleLeave}
            >
                Leave
            </Button>
            )
        </Fragment>
    )
};

const STATUS_MAP = {
    [ROOM_STATUS_WAITING]: () => `We need more players (2 minimum)`,
    [ROOM_STATUS_PAINTER_SELECTING]: ({ countdown }) => `Painter is being selected in ${countdown} (random)`,
    [ROOM_STATUS_WORD_SELECTING]: ({ painter }) => `Painter ${(painter || {}).nickname} is selecting a word`,
    [ROOM_STATUS_DRAWING]: ({ painter }) => `${(painter || {}).nickname} is drawing`,
    [ROOM_STATUS_GAME_FINISHED]: ({ winner }) => `The game is over. ${(winner || {}).nickname} wins`,
};

class Game extends PureComponent {

    generateStatus = () => {
        const { room: { status, countdown, winner }, painter } = this.props;
        return STATUS_MAP[status]({countdown, winner, painter});
    }

    render() {
        const { classes, room, onLeaveRoom, task, socket, player, children } = this.props;
        let { winner } = room;
        let status = this.generateStatus();
        return (
            <Fragment>
                <RoomInfoBar
                    data={[
                        {
                            label: 'Room',
                            value:  <RoomName
                                        name={room.roomName}
                                        handleLeave={onLeaveRoom}
                                    />,
                        },
                        {
                            label: 'Status',
                            value: status,
                        },
                        {...task},
                        {
                            label: 'Players',
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
                            chat={room.chat}
                            isPainter={player.isPainter}
                            socket={socket}
                        />
                    </Grid>
                </Grid>
                {/*<ButtonBar*/}
                {/*    onGamePreStart={onGamePreStart}*/}
                {/*    onLeaveRoom={onLeaveRoom}*/}
                {/*/>*/}
                <Winner
                    winner={winner}
                    word={room.word}
                />
            </Fragment>
        )
    }
}

export default withStyles(styles)(Game);