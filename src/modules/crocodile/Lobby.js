import React, { PureComponent } from 'react';
import { withStyles, Box } from "@material-ui/core";
import { LobbyNickname, LobbyRoomSelection } from './';
import {
    SOCKET_ON_LOBBY_STEP_CHANGE,
    LOBBY_STEP_NICKNAME,
    LOBBY_STEP_ROOM_SELECTION,
} from './constants';

const styles = (theme) => ({
    lobby: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: theme.palette.green[100],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lobbyContent: {
        position: 'relative',
    },
});

class Lobby extends PureComponent {

    constructor(props) {
        super(props);
        this.steps = {
            [LOBBY_STEP_NICKNAME]: this.renderLobbyNickname,
            [LOBBY_STEP_ROOM_SELECTION]: this.renderLobbyRoomSelection,
        };
        this.state = {
            step: LOBBY_STEP_NICKNAME,
        };
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on(SOCKET_ON_LOBBY_STEP_CHANGE, this.onStepChange);
    }

    componentWillUnmount() {
        const { socket } = this.props;
        socket.off(SOCKET_ON_LOBBY_STEP_CHANGE, this.onStepChange);
    }

    onStepChange = ({ step }) => {
        this.setStep(step);
    }

    setStep = (step) => {
        this.setState(() => ({
            step,
        }));
    }

    handleBackToNickname = () => {
        this.setStep(LOBBY_STEP_NICKNAME);
    }

    renderLobbyNickname = () => {
        const { socket } = this.props;
        return (
            <LobbyNickname
                socket={socket}
            />
        );
    }

    renderLobbyRoomSelection = () => {
        const { socket } = this.props;
        return (
            <LobbyRoomSelection
                socket={socket}
                onBackToNickname={this.handleBackToNickname}
            />
        );
    }

    render() {
        const { classes } = this.props;
        const { step } = this.state;
        return (
            <Box
                className={classes.lobby}
            >
                <Box
                    className={classes.lobbyContent}
                >
                    {
                        this.steps[step]()
                    }
                </Box>
            </Box>
        )
    }
}

export default withStyles(styles)(Lobby);