import React, { PureComponent } from 'react';
import socketIOClient from 'socket.io-client';
import { withStyles } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { SPEED, SOCKET_SERVER } from './constants';
import { Lobby, BodyOnline } from './';

const SOCKET_FROM           = 'CLIENT';
const SOCKET_TO             = 'SERVER';
const ON_INIT               = 'INIT';
const ON_LOG                = 'LOG';
const ON_MESSAGE            = 'MESSAGE';
const ON_START              = 'START';
const ON_GAME               = 'GAME';
const ON_LEAVE_SESSION      = 'LEAVE SESSION';
const EMIT_PLAYER_UPDATE    = 'PLAYER UPDATE';
const EMIT_HOST_FIND        = 'HOST FIND';
const EMIT_GAME             = 'GAME';
const EMIT_LEAVE_SESSION    = 'LEAVE SESSION';

const styles = () => ({

});

class Multi extends PureComponent {

    constructor(props) {
        super(props);
        this.handleStartNewGame = null;
        this.handlePause = null;
        this.handleContinue = null;
        this.handleEndGame = null;
        this.state = {
            user: {
                id: null,
                nickname: '',
                speed: SPEED,
                opponent: {
                    nickname: '',
                    table: [],
                    preview: [],
                    score: 0,
                    isFinish: false,
                },
            },
            isLobby: true,
            connectionType: 'host', //client
        }
    }

    componentDidMount() {

        this.socket = socketIOClient(SOCKET_SERVER);

        this.socket.on(SOCKET_FROM, ({ type, ...props }) => {
            switch(type) {
                case ON_LOG:
                    //console.log(props);
                    break;
                case ON_INIT:
                    const { id } = props;
                    this.setState(state => ({
                        user: {
                            ...state.user,
                            id,
                        },
                    }));
                    break;
                case ON_MESSAGE:
                    const { messageType, message } = props;
                    this.props.enqueueSnackbar(message, {
                        variant: messageType,
                        autoHideDuration: 2000,
                    });
                    break;
                case ON_START:
                    const { opponent } = props;
                    this.setState(state => ({
                        isLobby: false,
                        user: {
                            ...state.user,
                            opponent,
                        },
                    }));
                    break;
                case ON_GAME:
                    const { action, speed, ...other } = props;
                    this.setState(state => ({
                        user: {
                            ...state.user,
                            speed,
                            opponent: {
                                ...state.user.opponent,
                                ...other,
                            }
                        },
                    }));
                    if(action) this[action](false);
                    break;
                case ON_LEAVE_SESSION:
                    let user = {
                        id: this.state.user.id,
                        nickname: this.state.user.nickname,
                    }
                    this.setState(() => ({
                        isLobby: true,
                        user,
                    }));
                    break;
                default:
                    break;
            }
        });

    }

    handleStartNewGameCallback = (func) => {
        this.handleStartNewGame = func;
    }

    handlePauseCallback = (func) => {
        this.handlePause = func;
    }

    handleContinueCallback = (func) => {
        this.handleContinue = func;
    }

    handleEndGameCallback = (func) => {
        this.handleEndGame = func;
    }

    handleNicknameChange = (e) => {
        const { value } = e.target;
        this.setState(state => ({
            user: {
                ...state.user,
                nickname: value,
            }
        }));
        this.handleUpdatePlayer({
            nickname: value,
        })
    }

    handleConnectionTypeChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            connectionType: value,
        }))
    }

    handleFindHost = (host) => {
        const { user: { id } } = this.state;
        this.socket.emit(SOCKET_TO, {
            type: EMIT_HOST_FIND,
            id,
            host,
        });
    }

    handleUpdatePlayer = (params) => {
        const { user: { id } } = this.state;
        this.socket.emit(SOCKET_TO, {
            type: EMIT_PLAYER_UPDATE,
            id,
            ...params,
        });
    }

    handleGameOnline = (props) => {
        this.socket.emit(SOCKET_TO, {
            type: EMIT_GAME,
            ...props,
        });
    }

    handleBackToLobby = () => {
        this.setState(() => ({
            isLobby: true,
        }));
        this.socket.emit(SOCKET_TO, {
            type: EMIT_LEAVE_SESSION,
        });
    }

    render() {
        const { isLobby, connectionType, user } = this.state;
        const { id, nickname } = user;
        return isLobby ? (
            <Lobby
                id={id}
                connectionType={connectionType}
                onHostFind={this.handleFindHost}
                onConnectionTypeChange={this.handleConnectionTypeChange}
                onNicknameChange={this.handleNicknameChange}
                nickname={nickname}
            />
        ) : (
            <BodyOnline
                onGameOnline={this.handleGameOnline}
                handleStartNewGameCallback={this.handleStartNewGameCallback}
                handlePauseCallback={this.handlePauseCallback}
                handleContinueCallback={this.handleContinueCallback}
                handleEndGameCallback={this.handleEndGameCallback}
                onBackToLobby={this.handleBackToLobby}
                user={user}
            />
        );
    }

};


export default withSnackbar(withStyles(styles)(Multi));