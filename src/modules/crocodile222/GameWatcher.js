import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button } from "@material-ui/core";
import { Chat, Game, Paint, Screen } from "./";

const styles = (theme) => ({

});

class GameWatcher extends PureComponent {

    getPainterName = () => {
        const { room: { players } } = this.props;
        let id = Object.keys(players).find(player => players[player].isPainter);
        return players[id] && players[id].nickname;
    }

    getTask = (painter) => {
        const { room: { word } } = this.props;
        return word && word.length ? {
            label: 'Your task',
            value: `Try to guess the word that ${painter} is drawing`,
        } : {};
    }

    render() {
        const { room: { image, status } } = this.props;
        let painter = this.getPainterName();
        let task = this.getTask(painter);
        //console.log(painter);
        return (
            <Game
                task={task}
                {...this.props}
            >
                <Screen
                    image={image}
                    status={status}
                    painter={painter}
                />
            </Game>
        )
    }
}

export default withStyles(styles)(GameWatcher);