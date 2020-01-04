import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles, Box, AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import { update } from '../actions/room';
import { leaveRoom } from "../helpers/socket";
import { ROOM_STATUS_WAITING, ROOM_STATUS_PAINTER_SELECTING, ROOM_STATUS_WORD_SELECTING, ROOM_STATUS_DRAWING, ROOM_STATUS_GAME_FINISHED } from '../helpers/constants';

const styles = theme => ({
    appBar: {

    },
    room: {
        marginRight: theme.spacing(2),
    },
    status: {
        flexGrow: 1,
    },
});

const STATUS_MAP = {
    [ROOM_STATUS_WAITING]: () => `We need more players (2 minimum)`,
    [ROOM_STATUS_PAINTER_SELECTING]: ({ countdown }) => `Painter is being selected in ${countdown} (random)`,
    [ROOM_STATUS_WORD_SELECTING]: ({ painter }) => `Painter ${painter.nickname} is selecting a word`,
    [ROOM_STATUS_DRAWING]: ({ painter }) => `${painter.nickname} is drawing`,
    [ROOM_STATUS_GAME_FINISHED]: ({ winner }) => `The game is over. ${winner.nickname} wins`,
};

class Header extends PureComponent {

    handleLeave = () => {
        const { socket, resetRoom } = this.props;
        leaveRoom(socket);
        resetRoom();
    }

    generateStatus = () => {
        if(this.props.room) {
            const { room: { status, countdown, winner, painter } } = this.props;
            return STATUS_MAP[status]({countdown, winner, painter});
        }
    }

    render() {
        const { classes, room } = this.props;
        return (
            <Toolbar>
                <Typography
                    className={classes.room}
                    variant="h6"
                >
                    {room && room.roomName}
                </Typography>
                <Typography
                    className={classes.status}
                    variant="caption"
                >
                    {
                        this.generateStatus()
                    }
                </Typography>
                {
                    room && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={this.handleLeave}
                        >
                            Leave
                        </Button>
                    )
                }
            </Toolbar>
        )
    }
}

export default connect(
    store => {
        return {
            socket: store.socket,
            room: store.room,
        }
    },
    dispatch => {
        return {
            resetRoom: () => {
                return dispatch(update(null))
            }
        }
    }
)(withStyles(styles)(Header));