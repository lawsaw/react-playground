import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import GridMaterial from '@material-ui/core/Grid';
import { Body, Friend } from "./";

const styles = () => ({
    nickname: {
        //margin: 20,
    },
});

class BodyOnline extends PureComponent {

    render() {
        const { onGameOnline, user } = this.props;
        const { nickname, opponent: { table, score, nickname: opponentNickname, preview } } = user;
        return (
            <GridMaterial container>
                <GridMaterial item xs={6}>
                    <Box component="h2">{nickname || 'No name'}</Box>
                    <Body
                        onGameOnline={onGameOnline}
                        user={user}
                    />
                </GridMaterial>
                <GridMaterial item xs={6}>
                    <Box component="h2">{opponentNickname || 'No name'}</Box>
                    <Friend
                        table={table}
                        score={score}
                        preview={preview}
                    />
                </GridMaterial>
            </GridMaterial>
        )
    }

};

export default withStyles(styles)(BodyOnline);