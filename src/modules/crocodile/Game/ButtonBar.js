import React, { PureComponent } from 'react';
import { withStyles, Box, Button } from "@material-ui/core";

const styles = (theme) => ({
   buttonBar: {
       display: 'flex',
       justifyContent: 'center',
       flexWrap: 'wrap',
       '& > *': {
           margin: theme.spacing(0.5),
       },
   },
});

class ButtonBar extends PureComponent {

    handleGamePreStart = () => {
        const { onGamePreStart } = this.props;
        onGamePreStart({status: 'СТАТУС'});
    }

    render() {
        const { classes, onLeaveRoom } = this.props;
        return (
            <Box
                className={classes.buttonBar}
            >
                <Button
                    variant="outlined"
                    onClick={onLeaveRoom}
                >
                    Leave game
                </Button>
                <Button
                    variant="outlined"
                    onClick={e => this.handleGamePreStart(e)}
                >
                    Pre Start game
                </Button>
            </Box>
        )
    }
}

export default withStyles(styles)(ButtonBar);