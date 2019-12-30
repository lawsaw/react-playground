import React, { PureComponent, Fragment } from 'react';
import { withStyles } from "@material-ui/core";
import { GamePainter, GameWatcher } from "./";
import { SOCKET_ON_ROOM, SOCKET_ON_ROOM_LEAVE } from './constants';

const styles = (theme) => ({

});

const Interface = props => {
    return props.player.isPainter ? <GamePainter {...props} /> : <GameWatcher {...props} />
};

class GameInterface extends PureComponent {

    state = {
        room: null,
    }

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
        this.setState(() => ({
            room,
        }))
    }

    requestRoomData = () => {
        const { socket } = this.props;
        socket.emit(SOCKET_ON_ROOM);
    }

    handleLeaveRoom = () => {
        const { socket } = this.props;
        socket.emit(SOCKET_ON_ROOM_LEAVE);
    }

    getPlayer = () => {
        const { socket: { id } } = this.props;
        const { room } = this.state;
        let player = (room && room.players && room.players[id]) || {};
        player['id'] = id;
        return player;
    }

    getPainter = () => {
        const { room } = this.state;
        let players = (room && room.players) || {};
        let id = Object.keys(players).find(player => players[player].isPainter);
        return players[id];
    }

    render() {
        const { room } = this.state;
        //console.log(room);
        return room ? (
            <Interface
                room={room}
                onLeaveRoom={this.handleLeaveRoom}
                painter={this.getPainter()}
                player={this.getPlayer()}
                {...this.props}
            />
        ) : 'Room is loading'
    }
}

export default withStyles(styles)(GameInterface);