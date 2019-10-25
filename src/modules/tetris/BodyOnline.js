import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import GridMaterial from '@material-ui/core/Grid';
import { Body, Friend } from "./";

const styles = (theme) => ({
    nickname: {
        //margin: 20,
    },
});

class BodyOnline extends PureComponent {

    render() {
        const { onGameFinish, onGameOnline, user } = this.props;

        const { nickname, opponent: { table, score, nickname: opponentNickname } } = user;
        return (
            <GridMaterial container>
                <GridMaterial item xs={6}>
                    <Box component="h3">{nickname}</Box>
                    <Body
                        onGameOnline={onGameOnline}
                        onGameFinish={onGameFinish}
                        user={user}
                    />
                </GridMaterial>
                <GridMaterial item xs={6}>
                    <Box component="h3">{opponentNickname}</Box>
                    <Friend
                        table={table}
                        score={score}
                    />
                </GridMaterial>
            </GridMaterial>
        )
    }

};

export default withStyles(styles)(BodyOnline);