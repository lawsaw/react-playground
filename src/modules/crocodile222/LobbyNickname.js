import React, { PureComponent, Fragment } from 'react';
import { withStyles, Paper, IconButton, InputBase, Box, List, ListItem, ListItemText, Divider, Grid, Dialog } from "@material-ui/core";
import { Send, Add } from '@material-ui/icons';
import { TextInput } from './';
import { LOBBY_STEPS, LOBBY_STEP_NICKAME_CHANGING, LOBBY_STEP_ROOM_SELECTING, LOBBY_STEP_WORD_SELECTING } from './constants';
import { preventMultipleSubmit } from '../../helpers/etc';

const styles = (theme) => ({

});

class LobbyNickname extends PureComponent {

    constructor(props) {
        super(props);
        this.handleNicknameSubmitDecorator = preventMultipleSubmit();
    }

    handleNicknameSubmit = () => {
        const { onNicknameSubmit } = this.props;
        this.handleNicknameSubmitDecorator(onNicknameSubmit);
    }

    render() {
        const { onNicknameChange, nickname } = this.props;
        return (
            <TextInput
                onChange={onNicknameChange}
                onSubmit={this.handleNicknameSubmit}
                placeholder="Enter your nickname"
                value={nickname}
            />
        )
    }
}

export default withStyles(styles)(LobbyNickname);