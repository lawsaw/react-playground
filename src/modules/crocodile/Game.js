import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box } from "@material-ui/core";
import { Chat, Paint } from "./";

const styles = () => ({
    crocodile: {
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    paint: {},
    chat: {
        flexGrow: 1,
    },
});

class Screen extends PureComponent {

    renderPlayerList = () => {
        const { roomStore: { players } } = this.props;
        return (
            <Fragment>
                Current players:
                {
                    players.map(({ nickname, id }, index) => (
                        <Fragment
                            key={id}
                        >
                            <Box
                                component="span"
                            >
                                {nickname}
                            </Box>
                            {
                                index !== (players.length -1) ? ', ' : null
                            }
                        </Fragment>
                    ))
                }
            </Fragment>
        )
    }

    render() {
        const { classes, onConvertToImage, onChat, roomStore: { chat }, user } = this.props;
        let players = this.renderPlayerList();
        return (
            <Fragment>
                <Grid
                    container
                    spacing={1}
                    wrap="nowrap"
                    className={classes.crocodile}
                >
                    <Grid
                        item
                        container
                        spacing={1}
                        direction="column"
                        className={classes.paint}
                    >
                        <Paint
                            onConvertToImage={onConvertToImage}
                        />

                    </Grid>
                    <Grid
                        item
                        container
                        spacing={1}
                        direction="column"
                        className={classes.chat}
                    >
                        <Chat
                            chat={chat}
                            onChat={onChat}
                        />
                    </Grid>
                </Grid>
                {players}
            </Fragment>
        )
    }
}

export default withStyles(styles)(Screen);