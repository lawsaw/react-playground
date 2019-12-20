import React, { PureComponent, Fragment } from 'react';
import { withSnackbar } from 'notistack';
import socketIOClient from 'socket.io-client';
import { withStyles } from "@material-ui/core";
import { Lobby, GameInterface } from './';
import {SOCKET_MESSAGE, SOCKET_ON_LOBBY_STEP_CHANGE, SOCKET_ON_ROOM_JOIN, SOCKET_ON_ROOM_LEAVE} from "./constants";

export const SOCKET_SERVER = 'http://localhost:3005/';

const styles = () => ({

});

class Body extends PureComponent {

    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {
            isConnected: false,
            isLobby: true,
        };
    }

    componentDidMount() {
        this.initSocket();
    }

    componentWillUnmount() {
        this.stopSocket();
    }

    initSocket = () => {
        this.socket = socketIOClient(SOCKET_SERVER);
        this.socket.on('connect',               this.socketOnConnect);
        this.socket.on('disconnect',            this.socketOnDisconnect);
        this.socket.on(SOCKET_MESSAGE,          this.socketOnMessage);
        this.socket.on(SOCKET_ON_ROOM_JOIN,     this.socketOnRoomJoin);
        this.socket.on(SOCKET_ON_ROOM_LEAVE,    this.socketOnRoomLeave);
    }

    stopSocket = () => {
        this.socket.off(SOCKET_MESSAGE, this.socketOnMessage);
        this.socket.off(SOCKET_ON_ROOM_JOIN, this.socketOnRoomJoin);
        this.socket.off(SOCKET_ON_ROOM_LEAVE, this.socketOnRoomLeave);
        this.socket = null;
    }

    socketOnRoomJoin = () => {
        this.setState(() => ({
            isLobby: false,
        }));
    }

    socketOnRoomLeave = () => {
        this.setState(() => ({
            isLobby: true,
        }));
    }

    socketOnConnect = () => {
        this.setState(() => ({
            isConnected: true,
        }));
    }

    socketOnDisconnect = () => {
        this.setState(() => ({
            isConnected: false,
            isLobby: true,
        }));
    }

    socketOnMessage = ({ message_type, message }) => {
        const { enqueueSnackbar } = this.props;
        enqueueSnackbar(message, {
            variant: message_type,
            autoHideDuration: 1500,
        });
    }

    render() {
        const { isConnected, isLobby } = this.state;
        return isConnected ? (
            <Fragment>
                {
                    isLobby ? (
                        <Lobby
                            socket={this.socket}
                        />
                    ) : (
                        <GameInterface
                            socket={this.socket}
                        />
                    )
                }
            </Fragment>
        ) : (
            <Fragment>
                Not connected
            </Fragment>
        )
    }
}

export default withSnackbar(withStyles(styles)(Body));