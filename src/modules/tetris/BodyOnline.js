import React, { PureComponent } from 'react';
import Box from "@material-ui/core/Box";
import GridMaterial from '@material-ui/core/Grid';
import { Body, Friend } from "./";

class BodyOnline extends PureComponent {

    render() {
        const { user, ...props } = this.props;
        const { nickname, opponent: { table, score, nickname: opponentNickname, preview } } = user;
        return (
            <GridMaterial container>
                <GridMaterial item xs={6}>
                    <Box component="h2">{nickname || 'No name'}</Box>
                    <Body
                        user={user}
                        {...props}
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

export default BodyOnline;