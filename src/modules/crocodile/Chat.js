import React, { PureComponent, createRef, Fragment } from 'react';
import { isEqual } from 'lodash';
import { withStyles, Paper, TextField, Grid, IconButton, InputBase, Box, Card, CardContent, Typography } from "@material-ui/core";
import { Send } from '@material-ui/icons';
import { DESK_WIDTH, DESK_HEIGHT } from './constants';
import { getHeightFromWidth } from '../../helpers/etc';
import { TextInput } from './';

const styles = (theme) => ({
    chat: {
        flexGrow: 1,
    },
    wrapMessages: {
        position: 'relative',
        flexGrow: 1,
    },
    wrapSubmit: {},
    window: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    windowInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowX: 'hidden',
        overflowY: 'scroll',
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
    card: {
        margin: theme.spacing(1),
    },
    name: {
        textAlign: 'right',
    },
    message: {},
});

const Window = (props) => {
    const { classes, room } = props;
    const { chat } = room;
    return (
        <Paper
            elevation={5}
            square={true}
            className={classes.window}
        >
            <Box
                className={classes.windowInner}
            >
                {
                    chat && chat.length ? chat.map(({ id, player, message }, index) => {
                        let nickname = player.nickname;
                        return (
                            <Box
                                key={index}
                                className={classes.card}
                            >
                                <CardContent>
                                    <Typography className={classes.name} variant="h5" component="h2">{nickname || 'Default Name'}</Typography>
                                    <Typography className={classes.message} variant="body2" component="p">{message}</Typography>
                                </CardContent>
                            </Box>
                        )
                    }) : 'This chat is currently empty'
                }
            </Box>
        </Paper>
    )
};

class Chat extends PureComponent {

    constructor(props) {
        super(props);
        this.isSubmitLocked = false;
    }

    state = {
        message: '',
    }

    handleChat = () => {
        const { onChat } = this.props;
        const { message } = this.state;
        if(!this.isSubmitLocked && message.length > 0) {
            this.isSubmitLocked = true;
            console.log({
                message,
                length: message.length,
            })
            this.setState(() => ({
                message: '',
            }));
            onChat({ message });
            setTimeout(() => {
                this.isSubmitLocked = false;
            }, 1000);
        }
    }

    handleMessageChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            message: value,
        }));
    }

    render() {
        const { classes, chat, onChat } = this.props;
        const { message } = this.state;
        return (
            <Fragment>
                <Grid
                    item
                    className={classes.wrapMessages}
                >
                    <Window {...this.props} />
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