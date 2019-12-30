import React, {PureComponent } from 'react';
import { withStyles, Box, Chip } from "@material-ui/core";

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

    handleClick = playerId => (e) => {
        //console.log({playerId, e});
    }

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
                            onClick={this.handleClick(playerId)}
                        />
                    )) : 'There is no players in this room'
                }
            </Box>
        )
    }
}

export default withStyles(styles)(PlayersBar);