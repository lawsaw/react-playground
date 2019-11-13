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
    ROOM_STATUS_PAINTER_SELECTING,
    ROOM_STATUS_WORD_SELECTING,
    ROOM_STATUS_WAITING,
    ROOM_STATUS_DRAWING
} from './constants';
import { preventMultipleSubmit } from '../../helpers/etc';

const SOCKET_FROM           = 'CLIENT';
const SOCKET_TO             = 'SERVER';
const ON_INIT               = 'INIT';
const ON_NEW_ROOM           = 'NEW ROOM';
const ON_MESSAGE            = 'MESSAGE';
const ON_ROOM_SELECT        = 'ROOM SELECT';
const ON_ROOM_UPDATE               = 'GAME';
const ON_PLAYER_UPDATE      = 'PLAYER UPDATE';
const ON_ROOM_LIST          = 'ROOM LIST';
const ON_CALLBACK           = 'CALLBACK';
const ON_LOG                = 'LOG';
const ON_CHAT               = 'CHAT';
const ON_LOBBY              = 'LOBBY';
const ON_START              = 'START';
const ON_PRESTART           = 'PRE START';

const EMIT_INIT             = 'INIT';
const EMIT_NEW_ROOM         = 'NEW ROOM';
const EMIT_ROOM_SELECT      = 'ROOM SELECT';
const EMIT_ROOM_UPDATE             = 'GAME';
const EMIT_PLAYER_UPDATE    = 'PLAYER UPDATE';
const EMIT_CHAT             = 'CHAT';
const EMIT_LOBBY            = 'LOBBY';
const EMIT_START            = 'START';
const EMIT_ROOM_LOBBY         = 'PRE START';

const styles = () => ({

});

class Body extends PureComponent {

    constructor(props) {
        super(props);
        this.preventMultipleSubmitNickname = preventMultipleSubmit();
        this.preventMultipleSubmitNewRoom = preventMultipleSubmit();
        this.isConnected = false;
        this.state = {
            image: '',
            user: {
                nickname: '',
            },
            lobbyStep: LOBBY_STEP_NICKAME_CHANGING,
            //lobbyRoomStep: ROOM_STATUS_PAINTER_SELECTING,
            roomList: {},
            room: {},
            isNewRoomCreateModal: false,
            newRoomName: '',
        }
    }

    emit = (type, props={}) => {
        this.socket.emit(SOCKET_TO, {
            type,
            ...props,
        });
    }

    componentDidMount() {

    }

    listeningToSocket = () => {
        if(!this.isConnected) {
            this.socket = socketIOClient(SOCKET_SERVER);

            // socket.on('connect', function () {
            //
            // })

            this.socket.on(SOCKET_FROM, ({ type, ...props }) => {
                switch(type) {
                    case ON_LOG:
                        console.log(props);
                        break;
                    case ON_PLAYER_UPDATE:
                        this.onPlayerUpdate(props);
                        break;
                    case ON_CALLBACK:
                        this.onCallback(props);
                        break;
                    case ON_MESSAGE:
                        this.onMessage(props);
                        break;
                    case ON_ROOM_UPDATE:
                        this.onRoomUpdate(props);
                        break;
                    case ON_LOBBY:
                        this.onLobby(props);
                        break;
                    default:
                        break;
                }
            });
            this.isConnected = true;
        }
    }

    onLobby = ({ roomList }) => {
        this.setState(() => ({
            roomList,
        }));
    }

    onMessage = ({ messageType, message }) => {
        this.props.enqueueSnackbar(message, {
            variant: messageType,
            autoHideDuration: 2000,
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
            this.emitRoomUpdate({ image });
            // this.setState(() => ({
            //     image,
            // }));
        }
    }

    handleChat = ({ message }) => {
        const { user: { id } } = this.state;
        console.log({ id, message });
        const chat = { id, message };
        this.emitRoomUpdate({ chat });
    }

    onRoomUpdate = ({ room }) => {
        this.setState(() => ({
            room,
        }));
    }

    emitRoomUpdate = (props) => {
        this.emit(EMIT_ROOM_UPDATE, props);
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
        const { user } = this.state;
        e.preventDefault();
        if(!user.nickname.length) return false;
        this.listeningToSocket();
        this.preventMultipleSubmitNickname(() => this.emitPlayerUpdate('handlePlayerInit'));
    }

    handlePlayerInit = (id) => {
        this.handleSetPlayerId(id);
        this.handleLobbyStepRoomSelection();
    }

    handleNewRoomSubmit = (e) => {
        const { newRoomName } = this.state;
        e.preventDefault();
        this.preventMultipleSubmitNewRoom(() => this.emit(EMIT_NEW_ROOM, {
            room: newRoomName,
            callback: 'handleNewRoomCreateModalClose',
        }));
    }

    handleSetPlayerId = (id) => {
        this.setState(state => ({
            user: {
                ...state.user,
                id,
            },
        }));
    }

    handleJoinRoom = (room) => {
        this.emit(EMIT_ROOM_SELECT, {
            room,
            callback: 'LobbyLeave',
        });
    }

    emitPlayerUpdate = (callback) => {
        const { user } = this.state;
        this.emit(EMIT_PLAYER_UPDATE, {
            user,
            callback,
        });
    }

    onCallback = ({ callback, args }) => {
        this[callback](...args);
    }

    LobbyLeave = () => {
        this.setState(() => ({
            lobbyStep: null,
        }));
    }

    handleLobbyStepRoomSelection = () => {
        this.setState(() => ({
            lobbyStep: LOBBY_STEP_ROOM_SELECTING,
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

    handleLeaveRoom = () => {
        this.emitRoomUpdate({
            action: 'LEAVE',
        });
    }

    handleLeaveGame = () => {
        this.handleLobbyStepRoomSelection();
        this.handleLeaveRoom();
    }

    handleRoomLobbyInit = () => {
        this.emitRoomUpdate({
            status: ROOM_STATUS_PAINTER_SELECTING,
            callback: 'setRoomStatusWord',
        });
    }

    setRoomStatusWord = () => {
        console.log('пизда');
        this.emitRoomUpdate({
            status: ROOM_STATUS_WORD_SELECTING,
        });
    }

    handleWordSelect = (word) => {
        this.emitRoomUpdate({
            word,
            status: ROOM_STATUS_DRAWING,
        });
    }

    isLobbyPreset = () => {
        const { lobbyStep } = this.state;
        return (lobbyStep === LOBBY_STEP_NICKAME_CHANGING) || (lobbyStep === LOBBY_STEP_ROOM_SELECTING);
    }

    render() {
        const { image, user, lobbyStep, roomList, room, isNewRoomCreateModal, newRoomName } = this.state;
        return this.isLobbyPreset() ? (
            <Lobby
                onNicknameChange={this.handleNicknameChange}
                onNicknameSubmit={this.handleNicknameSubmit}
                user={user}
                lobbyStep={lobbyStep}
                roomList={roomList}
                onNewRoomSubmit={this.handleNewRoomSubmit}
                onRoomSelect={this.handleJoinRoom}
                isNewRoomCreateModal={isNewRoomCreateModal}
                newRoomName={newRoomName}
                onNewRoomCreateModalOpen={this.handleNewRoomCreateModalOpen}
                onNewRoomCreateModalClose={this.handleNewRoomCreateModalClose}
                onNewRoomNameChange={this.handleNewRoomNameChange}
            />
        ) : (
            <GameInterface
                onConvertToImage={this.handleConvertToImage}
                onChat={this.handleChat}
                user={user}
                room={room}
                onGameLeave={this.handleLeaveGame}
                onRoomLeave={this.handleLeaveRoom}
                onGamePreStart={this.handleRoomLobbyInit}
                onWordSelect={this.handleWordSelect}
            />
        )
    }
}

export default withSnackbar(withStyles(styles)(Body));