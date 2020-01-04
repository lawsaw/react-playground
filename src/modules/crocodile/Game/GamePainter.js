import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles, Box, Button, Dialog } from "@material-ui/core";
import { Paint, Game } from "./";
import { SOCKET_ON_WORD_SELECT, SOCKET_ON_PAINT } from '../helpers/constants';
import { Resizer } from '../Components';

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

    handleWordSelect = (e, word) => {
        const { socket } = this.props;
        socket.emit(SOCKET_ON_WORD_SELECT, word);
        //console.log('handleWordSelect ' + word);
    }

    handleConvertToImage = (canvas) => {
        //console.log('handleConvertToImage');
        if(!canvas) return false;
        const { socket } = this.props;
        let image = canvas.current.toDataURL();
        socket.emit(SOCKET_ON_PAINT, image);
    }

    getTask = () => {
        const { word } = this.props;
        return word ? {
            label: 'Your task',
            value: `Try to draw word "${word}"`,
        } : {};
    }

    isWordDefined = () => {
        const { word } = this.props;
        return !word ? true : false;
    }

    render() {
        const { classes, onWordSelect, words, ...props } = this.props;
        return (
            <Fragment>
                <Game
                    task={this.getTask()}
                    {...props}
                >
                    <Paint onConvertToImage={this.handleConvertToImage} />
                </Game>
                <Dialog
                    open={this.isWordDefined()}
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

export default connect(
    store => {
        return {
            socket: store.socket,
            word: store.room.word,
            words: store.room.words,
        }
    },
)(withStyles(styles)(GamePainter));