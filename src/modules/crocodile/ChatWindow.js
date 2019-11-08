import React, { PureComponent, Fragment, createRef } from 'react';
import {withStyles, Paper, Box } from "@material-ui/core";

const styles = (theme) => ({
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
    card: {
        margin: theme.spacing(1),
    },
    name: {
        textAlign: 'left',
        fontSize: theme.typography.pxToRem(13),

    },
    message: {
        textAlign: 'right',
        color: 'green',
        fontSize: theme.typography.pxToRem(12),
    },
    messageServer: {
        textAlign: 'right',
        fontSize: theme.typography.pxToRem(10),
    },
});

const MessageClient = ({ classes, sender, message }) => {
    return (
        <Box
            className={classes.card}
        >
            <Box fontWeight="fontWeightBold" className={classes.name}>{sender}</Box>
            <Box className={classes.message}>{message}</Box>
        </Box>
    );
};

const MessageServer = ({ classes, message }) => {
    return (
        <Box
            className={classes.card}
        >
            <Box fontWeight="fontWeightLight" className={classes.messageServer}>{message}</Box>
        </Box>
    );
};

class ChatWindow extends PureComponent {

    constructor(props) {
        super(props);
        this.windowRef = createRef();
    }

    componentDidMount() {
        this.scrollWindowToBottom();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollWindowToBottom();
    }

    scrollWindowToBottom = () => {
        if(this.windowRef && this.windowRef.current) {
            const { scrollHeight, clientHeight } = this.windowRef.current;
            this.windowRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }

    render() {
        const { classes, chat } = this.props;
        return (
            <Paper
                elevation={5}
                square={true}
                className={classes.window}
            >
                <Box
                    className={classes.windowInner}
                    ref={this.windowRef}
                >
                    {
                        chat && chat.length ? chat.map(({ id, player, message }, index) => {
                            return (
                                <Fragment
                                    key={index}
                                >
                                    {
                                        id === 'SERVER' ? (
                                            <MessageServer
                                                classes={classes}
                                                message={message}
                                            />
                                        ) : (
                                            <MessageClient
                                                classes={classes}
                                                message={message}
                                                sender={player.nickname}
                                            />
                                        )
                                    }
                                </Fragment>
                            )
                        }) : 'This chat is currently empty'
                    }
                </Box>
            </Paper>
        )
    }
}

export default withStyles(styles)(ChatWindow);