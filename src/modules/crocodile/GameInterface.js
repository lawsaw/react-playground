import React, { PureComponent, Fragment } from 'react';
import { withStyles } from "@material-ui/core";
import { GamePainter, GameWatcher } from "./";
import { SOCKET_ON_ROOM, SOCKET_ON_ROOM_LEAVE } from './constants';

const styles = (theme) => ({

});

class GameInterface extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            room: null,
        }
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

    // getPainter = () => {
    //     const { room } = this.props;
    //     let players = (room && room.players) || {};
    //     let id = Object.keys(players).find(player => players[player].isPainter);
    //     return players[id];
    // }

    getPlayer = () => {
        const { socket: { id } } = this.props;
        const { room } = this.state;
        let player = (room && room.players && room.players[id]) || {};
        player['id'] = id;
        return player;
    }

    render() {
        const { onConvertToImage, onWordSelect, ...props } = this.props;
        const { room } = this.state;
        let currentPlayer = this.getPlayer();
        return room ? (
            <Fragment>
                {
                    currentPlayer.isPainter ? (
                        <GamePainter
                            room={room}
                            user={currentPlayer}
                            onLeaveRoom={this.handleLeaveRoom}
                            {...props}
                        />
                    ) : (
                        <GameWatcher
                            room={room}
                            painter={currentPlayer.nickname}
                            onLeaveRoom={this.handleLeaveRoom}
                            {...props}
                        />
                    )
                }
            </Fragment>
        ) : 'Room is loading'
    }
}

export default withStyles(styles)(GameInterface);