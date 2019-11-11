import React, { PureComponent, Fragment } from 'react';
import { withSnackbar } from 'notistack';
import socketIOClient from 'socket.io-client';
import { withStyles, Grid } from "@material-ui/core";
import { Paint, Screen, Chat, Lobby, Game, GamePainter, GameWatcher, GameInterface } from './';
import { SOCKET_SERVER, LOBBY_STEPS, LOBBY_STEP_NICKAME_CHANGING, LOBBY_STEP_ROOM_SELECTING, LOBBY_STEP_WORD_SELECTING, ROOM_STATUS_WORD_SELECTING, LOBBY_ROOM_STEP_INIT } from './constants';
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
            lobbyRoomStep: LOBBY_ROOM_STEP_INIT,
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
                    case ON_ROOM_LIST:
                        this.onRoomList(props);
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
                    default:
                        break;
                }
            });
            this.isConnected = true;
        }
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

    onRoomList = ({ roomList }) => {
        this.setState(() => ({
            roomList,
        }));
    }

    onCallback = ({ callback, args }) => {
        this[callback](...args);
    }

    LobbyJoin = () => {
        this.emit(EMIT_LOBBY, {
            action: 'JOIN',
        });
    }

    LobbyLeave = () => {
        this.setState(() => ({
            lobbyStep: null,
        }));
        // this.emit(EMIT_LOBBY, {
        //     action: 'LEAVE',
        // });
    }

    handleLobbyStepRoomSelection = () => {
        this.setState(() => ({
            lobbyStep: LOBBY_STEP_ROOM_SELECTING,
        }));
        this.LobbyJoin();
    }

    // handleLobbyStepWordSelecting = () => {
    //     this.setState(() => ({
    //         lobbyStep: LOBBY_STEP_WORD_SELECTING,
    //     }));
    //     this.LobbyLeave();
    // }

    handleLobbyExit = () => {
        this.setState(() => ({
            lobbyStep: null,
        }));
        // this.emit(EMIT_LOBBY, {
        //     action: 'LEAVE', //JOIN || LEAVE
        // });
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

    onRoomLobbyInit = () => {
        this.emit(EMIT_ROOM_LOBBY, {
            status: LOBBY_ROOM_STEP_INIT,
        });
        this.setState(() => ({
            lobbyRoomStep: LOBBY_ROOM_STEP_INIT,
        }))
    }

    handleWordSelect = (word) => {
        this.onRoomLobbyInit({
            word,
            status: ROOM_STATUS_WORD_SELECTING,
            //callback: 'handleLobbyExit',
        });
    }

    isLobbyPreset = () => {
        const { lobbyStep } = this.state;
        return (lobbyStep === LOBBY_STEP_NICKAME_CHANGING) || (lobbyStep === LOBBY_STEP_ROOM_SELECTING);
    }






















    render() {
        const { image, user, lobbyStep, roomList, room, isNewRoomCreateModal, newRoomName, lobbyRoomStep } = this.state;
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
                lobbyRoomStep={lobbyRoomStep}
                onGameLeave={this.handleLeaveGame}
                onRoomLeave={this.handleLeaveRoom}
                onGamePreStart={this.onRoomLobbyInit}
                onWordSelect={this.handleWordSelect}
            />
        )
    }
}

export default withSnackbar(withStyles(styles)(Body));