import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button } from "@material-ui/core";
import { Chat, Paint, Screen, Game, GamePainter, GameWatcher } from "./";
import { ROOM_STATUS_PAINTER_SELECTING } from './constants';

const styles = (theme) => ({

});

class GameInterface extends PureComponent {

    // componentWillUnmount() {
    //     const { onRoomLeave } = this.props;
    //     console.log('componentWillUnmount');
    //     onRoomLeave();
    // }

    isPainter = () => {
        return false;
        //const { room, user } = this.props;
        //return room.players && room.players[user.id] && room.players[user.id].isPainter;
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