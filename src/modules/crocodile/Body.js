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

const EMIT_INIT             = 'INIT';
const EMIT_NEW_ROOM         = 'NEW ROOM';
const EMIT_ROOM_SELECT      = 'ROOM SELECT';
const EMIT_GAME             = 'GAME';

const styles = () => ({

});

class Body extends PureComponent {

    state = {
        image: '',
        user: {},
        lobbyStep: 1,
        roomList: {},
        roomStore: {},
    }

    componentDidMount() {
        this.socket = socketIOClient(SOCKET_SERVER);

        this.socket.on(SOCKET_FROM, ({ type, ...props }) => {
            let roomList, roomStore;
            switch(type) {
                case ON_MESSAGE:
                    const { messageType, message } = props;
                    this.props.enqueueSnackbar(message, {
                        variant: messageType,
                        autoHideDuration: 2000,
                    });
                    break;
                case ON_INIT:
                    roomList = props.roomList;
                    let id = props.id;
                    this.setState(state => ({
                        lobbyStep: 2,
                        roomList,
                        user: {
                            ...state.user,
                            id,
                        },
                    }));
                    break;
                case ON_NEW_ROOM:
                    roomList = props.roomList;
                    this.setState(() => ({
                        roomList,
                    }));
                    break;
                case ON_GAME:
                    roomStore = props.roomStore;
                    this.setState(state => ({
                        lobbyStep: null,
                        roomStore,
                    }));
                    break;
                default:
                    break;
            }
        });
    }

    handleConvertToImage = (canvas) => {
        if(canvas) {
            let image = canvas.current.toDataURL();
            this.setState(() => ({
                image,
            }));
        }
    }

    handleChat = ({ client, message }) => {
        console.log({ client, message });
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
        const { user } = this.state;
        this.socket.emit(SOCKET_TO, {
            type: EMIT_INIT,
            user,
        });
        //console.log('submit');
    }

    handleNewRoomSubmit = (e, room) => {
        e.preventDefault();
        console.log(room);
        this.socket.emit(SOCKET_TO, {
            type: EMIT_NEW_ROOM,
            room,
        });
    }

    handleRoomSelect = (room) => {
        this.socket.emit(SOCKET_TO, {
            type: EMIT_ROOM_SELECT,
            room,
        });
    }

    render() {
        const { image, user, lobbyStep, roomList, roomStore } = this.state;
        return lobbyStep ? (
            <Lobby
                onNicknameChange={this.handleNicknameChange}
                onNicknameSubmit={this.handleNicknameSubmit}
                user={user}
                lobbyStep={lobbyStep}
                roomList={roomList}
                onNewRoomSubmit={this.handleNewRoomSubmit}
                onRoomSelect={this.handleRoomSelect}
            />
        ) : (
            <Game
                onConvertToImage={this.handleConvertToImage}
                onChat={this.handleChat}
                user={user}
                roomStore={roomStore}
            />
        )
    }
}

export default withSnackbar(withStyles(styles)(Body));