import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from "@material-ui/core";
import { withSnackbar } from 'notistack';
import socketIOClient from 'socket.io-client';
import { Layout } from './Layout';
import { SOCKET_MESSAGE, SOCKET_ON_ROOM_JOIN, SOCKET_ON_ROOM_LEAVE } from "./helpers/constants";
import { init } from './actions/socket';
import { update } from './actions/room';

//export const SOCKET_SERVER = 'http://localhost:3005/';
export const SOCKET_SERVER = 'https://lawsaw-crocodile.herokuapp.com/';

class Main extends PureComponent {

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
        const { initSocket } = this.props;
        this.socket = socketIOClient(SOCKET_SERVER);
        this.socket.on('connect',               this.socketOnConnect);
        this.socket.on('disconnect',            this.socketOnDisconnect);
        this.socket.on(SOCKET_MESSAGE,          this.socketOnMessage);
        this.socket.on(SOCKET_ON_ROOM_JOIN,     this.socketOnRoomJoin);
        this.socket.on(SOCKET_ON_ROOM_LEAVE,    this.socketOnRoomLeave);
        initSocket(this.socket);

    }

    stopSocket = () => {
        const { initSocket } = this.props;
        this.socket.off(SOCKET_MESSAGE, this.socketOnMessage);
        this.socket.off(SOCKET_ON_ROOM_JOIN, this.socketOnRoomJoin);
        this.socket.off(SOCKET_ON_ROOM_LEAVE, this.socketOnRoomLeave);
        this.socket = null;
        initSocket(this.socket);
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
        const { resetRoom } = this.props;
        this.setState(() => ({
            isConnected: false,
            isLobby: true,
        }));
        resetRoom();
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
        return (
            <Fragment>
                <Layout
                    isConnected={isConnected}
                    isLobby={isLobby}
                />
            </Fragment>
        )
    }
}

export default connect(
    null,
    dispatch => {
        return {
            initSocket: socket => {
                dispatch(init(socket))
            },
            resetRoom: () => {
                return dispatch(update(null))
            }
        }
    }
)(withSnackbar(Main));