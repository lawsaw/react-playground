import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Button, Box } from "@material-ui/core";
import { Chat, PlayersBar, RoomInfoBar, Winner } from "./";
import { ROOM_STATUS_WAITING, ROOM_STATUS_PAINTER_SELECTING, ROOM_STATUS_WORD_SELECTING, ROOM_STATUS_DRAWING, ROOM_STATUS_GAME_FINISHED } from '../helpers/constants';
import { Resizer } from '../Components';

const styles = (theme) => ({
    crocodile: {
        alignItems: 'stretch',
        justifyContent: 'stretch',
        height: '100%',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
        }
    },
    paint: {
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    paintHeader: {},
    paintWork: {
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chat: {
        flexBasis: 220,
        flexShrink: 0,
        [theme.breakpoints.up('md')]: {
            flexBasis: 260,
        }
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

class Game extends PureComponent {

    render() {
        const { classes, room, task, player, children } = this.props;
        let { winner } = room;
        return (
            <Fragment>
                <Grid
                    container
                    spacing={0}
                    wrap="nowrap"
                    className={classes.crocodile}
                >
                    <Grid
                        item
                        className={classes.paint}
                    >
                        <Box
                            className={classes.paintWork}
                        >
                            {children}
                        </Box>
                        <Box
                            className={classes.paintHeader}
                        >
                            <RoomInfoBar
                                data={[
                                    {...task},
                                    {
                                        label: 'Players',
                                        value:  <PlayersBar />
                                    },
                                ]}
                            />
                        </Box>
                    </Grid>
                    <Grid
                        item
                        className={classes.chat}
                    >
                        <Chat />
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