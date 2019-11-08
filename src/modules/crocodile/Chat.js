import React, { PureComponent, createRef, Fragment } from 'react';
import { isEqual } from 'lodash';
import { withStyles, Paper, TextField, Grid, IconButton, InputBase, Box, Card, CardContent, Typography } from "@material-ui/core";
import { Send } from '@material-ui/icons';
import { DESK_WIDTH, DESK_HEIGHT } from './constants';
import { getHeightFromWidth } from '../../helpers/etc';
import { TextInput, ChatWindow } from './';
import { preventMultipleSubmit } from '../../helpers/etc';

const styles = (theme) => ({
    chat: {
        flexGrow: 1,
    },
    wrapMessages: {
        position: 'relative',
        flexGrow: 1,
    },
    wrapSubmit: {},
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

    handleChat = () => {
        const { onChat } = this.props;
        const { message } = this.state;
        if(message.length > 0) {
            this.setState(() => ({
                message: '',
            }));
            this.lockFuncChat(() => onChat({ message }));
        }
    }

    handleMessageChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            message: value,
        }));
    }

    render() {
        const { classes, room } = this.props;
        const { message } = this.state;
        return (
            <Fragment>
                <Grid
                    item
                    className={classes.wrapMessages}
                >
                    <ChatWindow
                        chat={room.chat}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.wrapSubmit}
                >
                    <TextInput
                        onChange={this.handleMessageChange}
                        onSubmit={this.handleChat}
                        placeholder="Enter your variant"
                        value={message}
                        className={classes.textField}
                        elevation={5}
                    />
                </Grid>
            </Fragment>
        )
    }
}

export default withStyles(styles)(Chat);