import React, { PureComponent, createRef, Fragment } from 'react';
import { isEqual } from 'lodash';
import { withStyles, Paper, TextField, Grid, IconButton, InputBase, Box, Card, CardContent, Typography } from "@material-ui/core";
import { Send } from '@material-ui/icons';
import { DESK_WIDTH, DESK_HEIGHT } from './constants';
import { getHeightFromWidth } from '../../helpers/etc';

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
    const { classes, chat } = props;
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
                    chat.map(({name, message}, index) => (
                        <Box
                            key={index}
                            className={classes.card}
                        >
                            <CardContent>
                                <Typography className={classes.name} variant="h5" component="h2">{name || 'Default Name'}</Typography>
                                <Typography className={classes.message} variant="body2" component="p">{message}</Typography>
                            </CardContent>
                        </Box>
                    ))
                }
            </Box>
        </Paper>
    )
};

class Chat extends PureComponent {

    state = {
        message: 'Fuck',
    }

    handleChat = () => {
        const { onChat } = this.props;
        const { message } = this.state;
        onChat({ message });
    }

    handleMessageChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            message: value,
        }))
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
                    <Paper
                        elevation={5}
                        className={classes.textField}
                    >
                        <InputBase
                            className={classes.input}
                            placeholder="Enter your variant"
                            value={message}
                            onChange={this.handleMessageChange}
                        />
                        <IconButton onClick={this.handleChat}>
                            <Send />
                        </IconButton>
                    </Paper>
                </Grid>
            </Fragment>
        )
    }
}

export default withStyles(styles)(Chat);