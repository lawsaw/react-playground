import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button } from "@material-ui/core";
import { Chat, Paint, Screen, GamePainter, GameWatcher } from "./";
import { ROOM_STATUS_PAINTER_SELECTING } from './constants';

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

    renderPlayerList = () => {
        const { classes, room: { players } } = this.props;
        const arrayOfPlayers = Object.keys(players);
        return (
            <Box
                className={classes.players}
            >
                Current players:
                {
                    players && arrayOfPlayers.length ? arrayOfPlayers.map((playerId, index) => (
                        <Chip
                            key={index}
                            size="small"
                            label={players[playerId].nickname}
                            color={players[playerId].isPainter ? 'primary' : 'default'}
                        />
                    )) : 'There is no players in this room'
                }
            </Box>
        )
    }

    handleGamePreStart = () => {
        const { onGamePreStart } = this.props;
        onGamePreStart({status: ROOM_STATUS_PAINTER_SELECTING});
    }

    render() {
        const { classes, onChat, room, user, onGameLeave, onGamePreStart, children } = this.props;
        console.log(room, user);
        let players = this.renderPlayerList();
        return (
            <Fragment>
                <Box>Room: {room.roomName}</Box>
                <Grid
                    container
                    spacing={1}
                    wrap="nowrap"
                    className={classes.crocodile}
                >
                    <Grid
                        item
                        container
                        spacing={1}
                        direction="column"
                        className={classes.paint}
                    >
                        {children}
                    </Grid>
                    <Grid
                        item
                        container
                        spacing={1}
                        direction="column"
                        className={classes.chat}
                    >
                        <Chat
                            room={room}
                            onChat={onChat}
                        />
                    </Grid>
                </Grid>
                <Button
                    variant="outlined"
                    onClick={onGameLeave}
                >
                    Leave game
                </Button>
                <Button
                    variant="outlined"
                    onClick={e => this.handleGamePreStart(e)}
                >
                    Pre Start game
                </Button>
                {players}
            </Fragment>
        )
    }
}

export default withStyles(styles)(Game);