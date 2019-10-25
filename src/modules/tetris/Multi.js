import React, { PureComponent, Fragment } from 'react';
import socketIOClient from 'socket.io-client';
import { withStyles } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import GridMaterial from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Body, Friend, Lobby, BodyOnline } from './';

const SOCKET_FROM           = 'CLIENT';
const SOCKET_TO             = 'SERVER';
const ON_INIT               = 'INIT';
const ON_LOG                = 'LOG';
const ON_MESSAGE            = 'MESSAGE';
const ON_START              = 'START';
const ON_GAME               = 'GAME';
const ON_GAME_FINISH        = 'GAME FINISH';
const EMIT_PLAYER_UPDATE    = 'PLAYER UPDATE';
const EMIT_HOST_FIND        = 'HOST FIND';
const EMIT_GAME             = 'GAME';
const EMIT_GAME_FINISH      = 'GAME FINISH';

const styles = () => ({

});

class Multi extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: null,
                nickname: '',
                opponent: {
                    table: [],
                    score: '0',
                },
            },
            isLobby: true,
            connectionType: 'host', //client
        }
    }

    componentDidMount() {

        this.socket = socketIOClient('http://localhost:3005/');

        this.socket.on(SOCKET_FROM, ({ type, ...props }) => {
            switch(type) {
                case ON_LOG:
                    console.log(props);
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
                        autoHideDuration: 3000,
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
                    const { table, score } = props;
                    this.setState(state => ({
                        user: {
                            ...state.user,
                            opponent: {
                                ...state.user.opponent,
                                table: table || state.user.opponent.table,
                                score: score || state.user.opponent.score,
                            }
                        },
                    }));
                    break;
                case ON_GAME_FINISH:
                    console.log('ON_GAME_FINISH');
                    console.log(props);
                    break;
            }
        });

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

    handleGameOnline = ({ table, score }) => {
        this.socket.emit(SOCKET_TO, {
            type: EMIT_GAME,
            table,
            score,
        });
    }

    handleGameFinish = () => {
        console.log('handleGameFinish');
        this.socket.emit(SOCKET_TO, {
            type: EMIT_GAME_FINISH,
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
                onUpdatePlayer={this.handleUpdatePlayer}
                onConnectionTypeChange={this.handleConnectionTypeChange}
                onNicknameChange={this.handleNicknameChange}
                nickname={nickname}
            />
        ) : (
            <BodyOnline
                onGameOnline={this.handleGameOnline}
                onGameFinish={this.handleGameFinish}
                user={user}
            />
        );
    }

};


export default withSnackbar(withStyles(styles)(Multi));