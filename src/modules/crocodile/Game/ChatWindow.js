import React, { PureComponent, Fragment, createRef } from 'react';
import cx from 'classnames';
import { withStyles, Paper, Box, Grid } from "@material-ui/core";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ThumbClicker } from './';
import { THUMB_STATUS_LIKE, THUMB_STATUS_DISLIKE } from '../helpers/constants';

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
        position: 'relative',
        padding: theme.spacing(1),
        '&:nth-child(2n)': {
            backgroundColor: fade(theme.palette.grey[400], 0.1),
        },
    },
    cardActive: {
        cursor: 'pointer',
        display: 'block',
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.light, 0.2),
        },
    },
    name: {
        textAlign: 'left',
        fontSize: theme.typography.pxToRem(13),
        paddingBottom: theme.spacing(2),
    },
    message: {
        textAlign: 'right',
        color: '#fff',
        fontSize: theme.typography.pxToRem(12),
    },
    messageServer: {
        textAlign: 'right',
        fontSize: theme.typography.pxToRem(10),
    },
    thumb: {
        fontSize: theme.typography.pxToRem(14),
        verticalAlign: 'middle',
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    thumbUp: {
        color: 'green',
    },
    thumbDown: {
        color: 'red',
    },
    thumbClicker: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 'auto',
        transition: 'opacity 0.3s ease 0s',
        opacity: 0,
        '$card:hover &': {
            opacity: 1,
        },
    },
});

const THUMB_MAP = {
    [THUMB_STATUS_LIKE]: classes => <ThumbUpIcon className={cx(classes.thumb, classes.thumbUp)} />,
    [THUMB_STATUS_DISLIKE]: classes => <ThumbDownIcon className={cx(classes.thumb, classes.thumbDown)} />,
}

const MessageClient = ({ classes, sender, message, onLikeMessage, likeStatus }) => {
    return (
        <Box
            className={classes.card}
        >
            {
                onLikeMessage ? (
                    <ThumbClicker
                        className={classes.thumbClicker}
                        onClick={onLikeMessage}
                    />
                ) : null
            }
            <Box fontWeight="fontWeightBold" className={classes.name}>
                {
                    likeStatus && THUMB_MAP[likeStatus](classes)
                }
                {sender}
            </Box>
            <Box className={classes.message}>
                {message}
            </Box>
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
        const { classes, chat, painterMode, onLikeMessage } = this.props;
        let lenta = chat && chat.length ? chat : [{
            player: { nickname: 'SERVER' },
            message: 'This chat is currently empty',
        }];
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
                        lenta.map(({ player, message, id, likeStatus }, index) => {
                            let { nickname } = player;
                            let likeHandler = painterMode ? {
                                onLikeMessage: onLikeMessage(id),
                            } : null;
                            return (
                                <Fragment
                                    key={index}
                                >
                                    {
                                        nickname === 'SERVER' ? (
                                            <MessageServer
                                                classes={classes}
                                                message={message}
                                            />
                                        ) : (
                                            <MessageClient
                                                classes={classes}
                                                message={message}
                                                sender={nickname}
                                                likeStatus={likeStatus}
                                                {...likeHandler}
                                            />
                                        )
                                    }
                                </Fragment>
                            )
                        })
                    }
                </Box>
            </Paper>
        )
    }
}

export default withStyles(styles)(ChatWindow);