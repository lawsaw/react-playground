import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles, Box } from "@material-ui/core";
import { GamePainter, GameWatcher } from "./";
import { SOCKET_ON_ROOM, SOCKET_ON_ROOM_LEAVE } from '../helpers/constants';
import { update } from '../actions/room';

const styles = () => ({
    interface: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
});

const Interface = ({isPainter, classes, ...props}) => {
    return isPainter ? <GamePainter {...props} /> : <GameWatcher {...props} />
};

class GameInterface extends PureComponent {

    componentDidMount() {
        const { socket } = this.props;
        socket.on(SOCKET_ON_ROOM, this.updateRoom);
        this.requestRoomData();
    }

    componentWillUnmount() {
        const { socket } = this.props;
        socket.off(SOCKET_ON_ROOM, this.updateRoom);
    }

    updateRoom = ({ room }) => {
        const { updateRoom } = this.props;
        updateRoom(room);
    }

    requestRoomData = () => {
        const { socket } = this.props;
        socket.emit(SOCKET_ON_ROOM);
    }

    getPlayer = () => {
        const { socket: { id }, room } = this.props;
        let player = (room && room.players && room.players[id]) || {};
        player['id'] = id;
        return player;
    }

    render() {
        const { classes, socket, room, painter } = this.props;
        let isPainter = socket.id === painter.id;
        return room ? (
            <Box className={classes.interface}>
                <Interface
                    isPainter={isPainter}
                    {...this.props}
                />
            </Box>
        ) : 'Room is loading'
    }
}

export default connect(
    store => {
        return {
            socket: store.socket,
            room: store.room,
            painter: (store.room || {}).painter || {},
        }
    },
    dispatch => {
        return {
            updateRoom: room => {
                dispatch(update(room))
            },
        }
    }
)(withStyles(styles)(GameInterface));