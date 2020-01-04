import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles } from "@material-ui/core";
import { Game, Screen } from "./";

const styles = (theme) => ({

});

class GameWatcher extends PureComponent {

    getTask = () => {
        const { word, painter } = this.props;
        return word ? {
            label: 'Your task',
            value: `Try to guess the word that ${painter.nickname} is drawing`,
        } : {};
    }

    render() {
        let task = this.getTask();
        return (
            <Game
                task={task}
                {...this.props}
            >
                <Screen />
            </Game>
        )
    }
}

export default connect(
    store => {
        return {
            word: store.room.word,
            painter: store.room.painter,
        }
    },
)(withStyles(styles)(GameWatcher));