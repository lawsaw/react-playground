import React, { PureComponent, Fragment } from 'react';
import { withSnackbar } from 'notistack';
import socketIOClient from 'socket.io-client';
import { withStyles, Grid } from "@material-ui/core";
import { Paint, Screen, Chat, Lobby, Game } from './';
import { SOCKET_SERVER } from './constants';

const SOCKET_FROM           = 'CLIENT';
const SOCKET_TO             = 'SERVER';
const ON_INIT               = 'INIT';
const ON_NEW_ROOM           = 'NEW ROOM';
const ON_MESSAGE            = 'MESSAGE';
const ON_ROOM_SELECT        = 'ROOM SELECT';
const ON_GAME               = 'GAME';
const ON_PLAYER_UPDATE      = 'PLAYER UPDATE';
const ON_ROOM_LIST          = 'ROOM LIST';
const ON_CALLBACK           = 'CALLBACK';
const ON_LOG                = 'LOG';
const ON_CHAT               = 'CHAT';

const EMIT_INIT             = 'INIT';
const EMIT_NEW_ROOM         = 'NEW ROOM';
const EMIT_ROOM_SELECT      = 'ROOM SELECT';
const EMIT_GAME             = 'GAME';
const EMIT_PLAYER_UPDATE    = 'PLAYER UPDATE';
const EMIT_CHAT             = 'CHAT';

const styles = () => ({

});

class Body extends PureComponent {

    state = {
        image: '',
        user: {},
        lobbyStep: 1,
        roomList: {},
        room: {},
        isNewRoomCreateModal: false,
        newRoomName: '',
    }

    componentDidMount() {
        this.socket = socketIOClient(SOCKET_SERVER);

        this.socket.on(SOCKET_FROM, ({ type, ...props }) => {
            switch(type) {
                // case ON_LOG:
                //     console.log(props);
                //     break;
                case ON_PLAYER_UPDATE:
                    this.onPlayerUpdate(props);
                    break;
                case ON_ROOM_LIST:
                    this.onRoomList(props);
                    break;
                case ON_CALLBACK:
                    this.onCallback(props);
                    break;
                case ON_MESSAGE:
                    const { messageType, message } = props;
                    this.props.enqueueSnackbar(message, {
                        variant: messageType,
                        autoHideDuration: 2000,
                    });
                    break;
                case ON_GAME:
                    this.onGame(props);
                    break;
                default:
                    break;
            }
        });
    }

    onPlayerUpdate = ({ user }) => {
        this.setState(state => ({
            user: {
                ...state.user,
                ...user,
            },
        }));
    }

    handleConvertToImage = (canvas) => {
        if(canvas) {
            let image = canvas.current.toDataURL();
            this.setState(() => ({
                image,
            }));
        }
    }

    handleChat = ({ message }) => {
        const { user: { id } } = this.state;
        console.log({ id, message });
        const chat = { id, message };
        this.emitGame({ chat });
    }

    onGame = ({ room }) => {
        this.setState(() => ({
            room,
        }));
    }

    emitGame = (props) => {
        this.socket.emit(SOCKET_TO, {
            type: EMIT_GAME,
            ...props,
        });
    }

    handleNicknameChange = (e) => {
        const { value } = e.target;
        this.setState(state => ({
            user: {
                ...state.user,
                nickname: value,
            },
        }));
    }

    handleNicknameSubmit = (e) => {
        e.preventDefault();
        this.emitPlayerUpdate('handlePlayerInit');
    }

    handlePlayerInit = (id) => {
        console.log(id);
        this.handleSetPlayerId(id);
        this.handleLobbyStepRoomSelection();
    }

    handleNewRoomSubmit = (e) => {
        const { newRoomName } = this.state;
        e.preventDefault();
        this.socket.emit(SOCKET_TO, {
            type: EMIT_NEW_ROOM,
            room: newRoomName,
            callback: 'handleNewRoomCreateModalClose',
        });
    }

    handleSetPlayerId = (id) => {
        this.setState(state => ({
            user: {
                ...state.user,
                id,
            },
        }));
    }

    handleRoomSelect = (room) => {
        this.socket.emit(SOCKET_TO, {
            type: EMIT_ROOM_SELECT,
            room,
            callback: 'handleLobbyExit',
        });
    }

    emitPlayerUpdate = (callback) => {
        const { user } = this.state;
        this.socket.emit(SOCKET_TO, {
            type: EMIT_PLAYER_UPDATE,
            user,
            callback,
        });
    }

    onRoomList = ({ roomList }) => {
        this.setState(() => ({
            roomList,
        }));
    }

    onCallback = ({ callback, args }) => {
        this[callback](...args);
    }

    handleLobbyStepRoomSelection = () => {
        this.setState(() => ({
            lobbyStep: 2,
        }));
    }

    handleLobbyExit = () => {
        this.setState(() => ({
            lobbyStep: null,
        }));
    }

    handleNewRoomNameChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            newRoomName: value,
        }));
    }

    handleNewRoomCreateModalOpen = () => {
        this.setState(() => ({
            isNewRoomCreateModal: true,
        }));
    }

    handleNewRoomCreateModalClose = () => {
        this.setState(() => ({
            isNewRoomCreateModal: false,
            newRoomName: '',
        }));
    }

    render() {
        const { image, user, lobbyStep, roomList, room, isNewRoomCreateModal, newRoomName } = this.state;
        return lobbyStep ? (
            <Lobby
                onNicknameChange={this.handleNicknameChange}
                onNicknameSubmit={this.handleNicknameSubmit}
                user={user}
                lobbyStep={lobbyStep}
                roomList={roomList}
                onNewRoomSubmit={this.handleNewRoomSubmit}
                onRoomSelect={this.handleRoomSelect}
                isNewRoomCreateModal={isNewRoomCreateModal}
                newRoomName={newRoomName}
                onNewRoomCreateModalOpen={this.handleNewRoomCreateModalOpen}
                onNewRoomCreateModalClose={this.handleNewRoomCreateModalClose}
                onNewRoomNameChange={this.handleNewRoomNameChange}
            />
        ) : (
            <Game
                onConvertToImage={this.handleConvertToImage}
                onChat={this.handleChat}
                user={user}
                room={room}
            />
        )
    }
}

export default withSnackbar(withStyles(styles)(Body));