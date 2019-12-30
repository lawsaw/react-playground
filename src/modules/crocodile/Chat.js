import React, { PureComponent } from 'react';
import { withStyles, Grid } from "@material-ui/core";
import { TextInput, ChatWindow } from './';
import { preventMultipleSubmit } from '../../helpers/etc';
import { SOCKET_ON_CHAT, SOCKET_ON_MESSAGE_LIKE } from './constants';

const styles = (theme) => ({
    chat: {
        flexGrow: 1,
    },
    wrapChat: {
        position: 'relative',
        height: '100%',
        margin: 0,
    },
    wrapMessages: {
        position: 'relative',
        flexGrow: 1,
        padding: '0 !important',
    },
    wrapSubmit: {
        flexShrink: 0,
        padding: `${theme.spacing(1)}px 0 0 0 !important`,

    },
    textField: {
        width: '100%',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        flex: 1,
    },
});

class Chat extends PureComponent {

    constructor(props) {
        super(props);
        this.lockFuncChat = preventMultipleSubmit();
        this.state = {
            message: '',
        }
    }

    onChat = (message) => {
        const { socket } = this.props;
        socket.emit(SOCKET_ON_CHAT, message);
        console.log(message);
    }

    handleChat = () => {
        const { message } = this.state;
        if(message.length > 0) {
            this.setState(() => ({
                message: '',
            }));
            this.lockFuncChat(() => this.onChat(message));
        }
    }

    handleMessageChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            message: value,
        }));
    }

    handleLikeMessage = id => e => {
        const { socket } = this.props;
        socket.emit(SOCKET_ON_MESSAGE_LIKE, id);
    }

    render() {
        const { classes, chat, isPainter } = this.props;
        const { message } = this.state;
        return (
            <Grid
                container
                spacing={1}
                direction="column"
                className={classes.wrapChat}
            >
                <Grid
                    item
                    className={classes.wrapMessages}
                >
                    <ChatWindow
                        chat={chat}
                        isPainter={isPainter}
                        onLikeMessage={this.handleLikeMessage}
                    />
                </Grid>
                {
                    !isPainter ? (
                        <Grid
                            item
                            className={classes.wrapSubmit}
                        >
                            <TextInput
                                onChange={this.handleMessageChange}
                                onSubmit={this.handleChat}
                                placeholder="Message"
                                value={message}
                                className={classes.textField}
                                elevation={5}
                            />
                        </Grid>
                    ) : null
                }
            </Grid>
        )
    }
}

export default withStyles(styles)(Chat);