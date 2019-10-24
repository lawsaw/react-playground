import React, { PureComponent, Fragment } from 'react';
import socketIOClient from 'socket.io-client';
import { withStyles } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import GridMaterial from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import { Body, Friend, Lobby } from './';

const styles = () => ({

});

class Multi extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            socket: {},
            id: null,
            friend: null,
            isLobby: true,
            friendInput: '',
            friendTable: null,
            listOfClients: [],
            client: null,
            lobbyStatus: null,
            type: 'host', //client
        }
    }

    componentDidMount() {

        this.socket = socketIOClient('http://localhost:3005/');

        this.socket.on('init', (id) => {
            console.log(id);
            this.setState(() => ({
                id,
            }))
        });

        // this.socket.on('start', ({ master, friend }) => {
        //     console.log({master, friend});
        //     this.setState(() => ({
        //         isLobby: false,
        //         friend: friend,
        //         id: master,
        //     }))
        // });
        //
        this.socket.on('message', ({ type, message }) => {
            this.props.enqueueSnackbar(message, {
                variant: type,
                autoHideDuration: 3000,
            });
        });
        //
        // this.socket.on('game', ({ friend, table }) => {
        //     this.setState(() => ({
        //         friendTable: table,
        //     }))
        // });

        this.socket.on('update host\'s lobby', (client) => {
            console.log(client);
            this.setState(() => ({
                client: client,
            }))
        });

        this.socket.on('lobby status', (status) => {
            console.log(status);
            this.setState(() => ({
                lobbyStatus: status,
            }))
        });

    }

    handleTypeChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            type: value,
        }))
    }

    handleFriendInputChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            friendInput: value,
        }))
    }

    handleFriendInvite = (host, nickname) => {
        const { id } = this.state;
        this.socket.emit('find host', {
            id,
            nickname,
            host,
        });
    }

    handleUpdatePlayer = ({ nickname }) => {
        const { id } = this.state;
        this.socket.emit('update player', {
            id,
            nickname,
        });
    }

    renderGame = () => {
        const { id, friend, friendTable } = this.state;
        let server = {
            master: id,
            friend,
            socket: this.socket,
        };
        return (
            <GridMaterial container>
                <GridMaterial item xs={6}>
                    <Body server={server} />
                </GridMaterial>
                <GridMaterial item xs={6}>
                    <Friend
                        table={friendTable}
                        score={10}
                    />
                </GridMaterial>
            </GridMaterial>
        )
    }

    render() {
        const { isLobby, id, client, lobbyStatus, type } = this.state;
        return isLobby ? <Lobby
            id={id}
            type={type}
            status={lobbyStatus}
            client={client}
            onFriendInvite={this.handleFriendInvite}
            onUpdatePlayer={this.handleUpdatePlayer}
            onTypeChange={this.handleTypeChange}
        /> : this.renderGame();
    }

};


export default withSnackbar(withStyles(styles)(Multi));