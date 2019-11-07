import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip } from "@material-ui/core";
import { Chat, Paint } from "./";

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

class Screen extends PureComponent {

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

    render() {
        const { classes, onConvertToImage, onChat, room, user } = this.props;
        let players = this.renderPlayerList();
        return (
            <Fragment>
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
                        <Paint
                            onConvertToImage={onConvertToImage}
                        />

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
                {players}
            </Fragment>
        )
    }
}

export default withStyles(styles)(Screen);