import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button } from "@material-ui/core";
import { Chat, Paint, Screen, Game, GamePainter, GameWatcher } from "./";

const styles = (theme) => ({

});

class GameInterface extends PureComponent {

    componentWillUnmount() {
        const { onRoomLeave } = this.props;
        console.log('componentWillUnmount');
        onRoomLeave();
    }

    isPainter = () => {
        const { room, user } = this.props;
        return room.players[user.id].isPainter;
    }

    render() {
        const { onConvertToImage, onWordSelect, onChat, ...props } = this.props;
        return this.isPainter() ? (
            <GamePainter
                onConvertToImage={onConvertToImage}
                onWordSelect={onWordSelect}
                {...props}
            />
        ) : (
            <GameWatcher
                onChat={onChat}
                {...props}
            />
        )
    }
}

export default withStyles(styles)(GameInterface);