import React, { PureComponent, Fragment } from 'react';
import { withSnackbar } from 'notistack';
import socketIOClient from 'socket.io-client';
import { withStyles, Grid } from "@material-ui/core";
import { Paint, Screen, Chat, Lobby, Game, GamePainter, GameWatcher, GameInterface } from './';
import {
    SOCKET_SERVER,
    LOBBY_STEPS,
    LOBBY_STEP_NICKAME_CHANGING,
    LOBBY_STEP_ROOM_SELECTING,

    ROOM_STATUS_WAITING,
    ROOM_STATUS_PAINTER_SELECTING,
    ROOM_STATUS_WORD_SELECTING,
    ROOM_STATUS_DRAWING,
    ROOM_STATUS_GAME_FINISHED,
} from './constants';
import { preventMultipleSubmit } from '../../helpers/etc';


const SOCKET_CHANNEL_INIT = 'SOCKET_CHANNEL_INIT';
const SOCKET_CHANNEL_MESSAGE = 'SOCKET_CHANNEL_MESSAGE';
const SOCKET_CHANNEL_LOBBY = 'SOCKET_CHANNEL_LOBBY';
const SOCKET_CHANNEL_ROOM_ACCESS = 'SOCKET_CHANNEL_ROOM_ACCESS';
const SOCKET_CHANNEL_ROOM_ADD = 'SOCKET_CHANNEL_ROOM_ADD';
const SOCKET_CHANNEL_CALLBACK = 'SOCKET_CHANNEL_CALLBACK';
const SOCKET_CHANNEL_ROOM = 'SOCKET_CHANNEL_ROOM';


const ROOM_ACTION_JOIN = 'ROOM_ACTION_JOIN';
const ROOM_ACTION_LEAVE = 'ROOM_ACTION_LEAVE';
const ROOM_ACTION_UPDATE = 'ROOM_ACTION_UPDATE';

const styles = () => ({

});

class Body extends PureComponent {

    constructor(props) {
        super(props);
        this.isConnected = false;
        this.state = {
            server: {
                user: {
                    nickname: '',
                },
                room: {},
            },
            nickname: '',
            lobby_step: 1,
        };
    }

    componentDidMount() {
        this.listeningToSocket();
    }

    listeningToSocket = () => {
        if(!this.isConnected) {
            this.socket = socketIOClient(SOCKET_SERVER);
            this.socket.on(SOCKET_CHANNEL_INIT, props => {this.socketOnInit(props)});
            this.socket.on(SOCKET_CHANNEL_MESSAGE, props => {this.socketOnMessage(props)});
            this.socket.on(SOCKET_CHANNEL_LOBBY, props => {this.socketOnLobby(props)});
            this.socket.on(SOCKET_CHANNEL_ROOM_ACCESS, props => {this.socketOnRoomAccess(props)});
            this.socket.on(SOCKET_CHANNEL_ROOM_ADD, props => {this.socketOnRoomAdd(props)});
            this.socket.on(SOCKET_CHANNEL_CALLBACK, props => {this.socketOnCallback(props)});
            this.socket.on(SOCKET_CHANNEL_ROOM, props => {this.socketOnRoom(props)});
            this.isConnected = true;
        }
    }

    socketToInit = (props) => {
        this.socket.emit(SOCKET_CHANNEL_INIT, props);
    }

    socketOnInit = (props) => {
        this.setState(state => ({
            server: {
                ...state.server,
                user: {
                    ...state.server.user,
                    ...props,
                },
            },
            nickname: '',
            lobby_step: 2,
        }));
    }

    handleNicknameChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            nickname: value,
        }));
    }

    handleNicknameSubmit = () => {
        const { nickname } = this.state;
        this.socketToInit({
            nickname,
        });
    }

    socketOnMessage = ({ message_type, message }) => {
        const { enqueueSnackbar } = this.props;
        enqueueSnackbar(message, {
            variant: message_type,
            autoHideDuration: 2000,
        });
    }

    socketOnLobby = ({ rooms }) => {
        this.setState(() => ({
            rooms,
        }));
    }

    handleNewRoomSubmit = (new_room_name) => {
        console.log(new_room_name);
    }

    handleJoinRoom = (room) => {
        console.log(room);
        this.socket.emit(SOCKET_CHANNEL_ROOM_ACCESS, {
            room,
            action: ROOM_ACTION_JOIN,
            callback: 'goToGameInterface',
        });
    }

    goToGameInterface = () => {
        this.setState(() => ({
            lobby_step: null,
        }));
    }

    socketOnCallback = ({ callback, args }) => {
        this[callback](args);
    }

    socketOnRoomAccess = ({ action, room }) => {
        switch (action) {
            case ROOM_ACTION_UPDATE:
                console.log(ROOM_ACTION_UPDATE);
                this.setState(state => ({
                    server: {
                        ...state.server,
                        room,
                    },
                }));
                break;
            case ROOM_ACTION_LEAVE:
                console.log(ROOM_ACTION_LEAVE);
                this.setState(state => ({
                    server: {
                        ...state.server,
                        room: {},
                    },
                    lobby_step: 2,
                }));
                break;
            default:
                console.log('default');
                break;
        }

    }

    socketOnRoomAdd = () => {

    }

    handleConvertToImage = () => {}
    handleChat = () => {}
    handleLeaveRoom = () => {
        const { server: { room: { roomName } } } = this.state;
        console.log(roomName);
        this.socket.emit(SOCKET_CHANNEL_ROOM_ACCESS, {
            action: ROOM_ACTION_LEAVE,
            room: roomName,
        });
    }
    handleWordSelect = () => {}

    socketOnRoom = ({ room }) => {
        this.setState(state => ({
            server: {
                ...state.server,
                room,
            },
        }));
    }

    render() {
        const { nickname, server, lobby_step, rooms } = this.state;
        console.log({ server, rooms });
        return lobby_step === null ? (
            <GameInterface
                onConvertToImage={this.handleConvertToImage}
                onChat={this.handleChat}
                room={server.room}
                user={server.user}
                onRoomLeave={this.handleLeaveRoom}
                onWordSelect={this.handleWordSelect}
            />
        ) : (
            <Lobby
                lobby_step={lobby_step}
                nickname={nickname}
                rooms={rooms}
                onNicknameSubmit={this.handleNicknameSubmit}
                onNicknameChange={this.handleNicknameChange}
                onNewRoomSubmit={this.handleNewRoomSubmit}
                onJoinRoom={this.handleJoinRoom}
            />
        )
    }
}

export default withSnackbar(withStyles(styles)(Body));