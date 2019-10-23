import React, { PureComponent, Fragment } from 'react';
import socketIOClient from 'socket.io-client';
import { withStyles } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import GridMaterial from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import { Body, Friend } from './';

const styles = () => ({

});

class Multi extends PureComponent {

    constructor(props) {
        super(props);
        this.socket = socketIOClient('http://localhost:3005/');
        this.state = {
            socket: {},
            myId: null,
            friend: null,
            isLobby: true,
            friendInput: '',
            friendTable: null,
        }
    }

    componentDidMount() {
        this.socket.on('init', (id) => {
            console.log(id);
            this.setState(() => ({
                myId: id,
            }))
        });
        this.socket.on('start', ({ master, friend }) => {
            console.log({master, friend});
            this.setState(() => ({
                isLobby: false,
                friend: friend,
                myId: master,
            }))
        });

        this.socket.on('message', ({ type, message }) => {
            this.props.enqueueSnackbar(message, {
                variant: type,
                autoHideDuration: 1500,
            });
        });

        this.socket.on('game', ({ friend, table }) => {
            this.setState(() => ({
                friendTable: table,
            }))
        });

    }

    handleFriendInputChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            friendInput: value,
        }))
    }

    handleSubmitFriendId = () => {
        const { friendInput, myId } = this.state;
        let players = {
            master: myId,
            friend: friendInput,
        };
        this.socket.emit('friend', players);
    }



    renderLobby = () => {
        const { myId, friendInput } = this.state;
        return (
            <GridMaterial container justify="flex-start" alignItems="center">
                <GridMaterial item xs={6}>
                    {
                        myId ? (
                            <Fragment>
                                Your ID is <strong>{myId}</strong>
                            </Fragment>
                        ) : (
                            <Fragment>
                                Loading socket...
                            </Fragment>
                        )
                    }
                </GridMaterial>
                <GridMaterial item xs={6}>
                    <TextField
                        label="Friend's ID"
                        margin="normal"
                        variant="outlined"
                        value={friendInput}
                        onChange={this.handleFriendInputChange}
                    />
                    <IconButton onClick={this.handleSubmitFriendId} disabled={!friendInput.length}>
                        <SendIcon />
                    </IconButton>
                </GridMaterial>

            </GridMaterial>
        )
    }

    renderGame = () => {
        const { myId, friend, friendTable } = this.state;
        let server = {
            master: myId,
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
        const { isLobby } = this.state;
        return isLobby ? this.renderLobby() : this.renderGame();
    }

};


export default withSnackbar(withStyles(styles)(Multi));