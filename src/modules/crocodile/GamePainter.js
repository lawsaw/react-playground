import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid, Box, Chip, Button, Dialog } from "@material-ui/core";
import { Chat, Paint, Screen, Game } from "./";

const styles = (theme) => ({
    wordList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
    },
    wordButton: {
        width: '100%',
        '&:not(:first-child)': {
            marginTop: theme.spacing(1),
        }
    },
});

class GamePainter extends PureComponent {

    state = {
        isModalWord: true,
    }

    // handleModalWord = () => {
    //     this.setState(state => ({
    //         isModalWord: !state.isModalWord,
    //     }))
    // }

    handleModalWordOpen = () => {
        this.setState(() => ({
            isModalWord: true,
        }))
    }

    handleModalWordClose = () => {
        this.setState(() => ({
            isModalWord: false,
        }))
    }

    getWordList = () => {
        const { room, user } = this.props;
        return room.players[user.id].words;
    }

    handleWordSelect = (e, word) => {
        const { onWordSelect } = this.props;
        this.handleModalWordClose();
        onWordSelect(word);
    }

    getTask = () => {
        const { room: { word } } = this.props;
        return word && word.length ? {
            label: 'Your task',
            value: `Try to draw word "${word}"`,
        } : {};
    }

    render() {
        const { classes, onConvertToImage, onWordSelect, ...props } = this.props;
        const { isModalWord } = this.state;
        let words = this.getWordList();
        let task = this.getTask();
        return (
            <Fragment>

                <Game
                    task={task}
                    {...props}
                >
                    <Paint onConvertToImage={onConvertToImage} />
                </Game>
                <Dialog
                    open={isModalWord}
                >
                    <Box
                        className={classes.wordList}
                    >
                        {
                            words.map((word, index) => (
                                <Button
                                    key={index}
                                    className={classes.wordButton}
                                    variant="outlined"
                                    onClick={e => this.handleWordSelect(e, word)}
                                >
                                    {word}
                                </Button>
                            ))
                        }
                    </Box>
                </Dialog>
            </Fragment>

        )
    }
}

export default withStyles(styles)(GamePainter);