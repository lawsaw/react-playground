import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button } from "@material-ui/core";
import { Chat, Game, Paint, Screen } from "./";

const styles = (theme) => ({

});

class GameWatcher extends PureComponent {

    getTask = () => {
        const { room: { word }, painter } = this.props;
        return word && word.length ? {
            label: 'Your task',
            value: `Try to guess the word that ${(painter || {}).nickname} is drawing`,
        } : {};
    }

    render() {
        const { room: { image, status } } = this.props;
        let task = this.getTask();
        return (
            <Game
                task={task}
                {...this.props}
            >
                <Screen
                    image={image}
                    status={status}
                />
            </Game>
        )
    }
}

export default withStyles(styles)(GameWatcher);