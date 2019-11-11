import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button } from "@material-ui/core";
import { Chat, Game, Paint, Screen } from "./";

const styles = (theme) => ({

});

class GameWatcher extends PureComponent {

    render() {
        const { room: { image, status }, lobbyRoomStep } = this.props;
        return (
            <Game {...this.props}>
                <Screen image={image} status={status} />
            </Game>
        )
    }
}

export default withStyles(styles)(GameWatcher);