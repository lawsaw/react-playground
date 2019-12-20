import React, {PureComponent, createRef, Fragment} from 'react';
import { isEqual } from 'lodash';
import { withStyles, Paper, Box, Button, Chip } from "@material-ui/core";
import { ROOM_STATUS_PAINTER_SELECTING } from './constants';
import { getHeightFromWidth } from '../../helpers/etc';

const styles = (theme) => ({
    players: {
        alignSelf: 'flex-start',
       display: 'flex',
       justifyContent: 'center',
       flexWrap: 'wrap',
       '& > *': {
           margin: theme.spacing(0.5),
       },
   },
});

class PlayersBar extends PureComponent {

    render() {
        const { classes, players } = this.props;
        const arrayOfPlayers = Object.keys(players);
        return (
            <Box
                className={classes.players}
            >
                {
                    players && arrayOfPlayers.length ? arrayOfPlayers.map((playerId, index) => (
                        <Chip
                            key={index}
                            size="small"
                            label={players[playerId].nickname}
                            color={players[playerId].isPainter ? 'primary' : 'default'}
                        />
                    )) : 'There is no players in this room'
                }
            </Box>
        )
    }
}

export default withStyles(styles)(PlayersBar);