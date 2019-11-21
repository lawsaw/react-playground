import React, {PureComponent, createRef, Fragment} from 'react';
import { isEqual } from 'lodash';
import { withStyles, Paper, Box, Button } from "@material-ui/core";
import { ROOM_STATUS_PAINTER_SELECTING } from './constants';
import { getHeightFromWidth } from '../../helpers/etc';

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
        onGamePreStart({status: ROOM_STATUS_PAINTER_SELECTING});
    }

    render() {
        const { classes, onRoomLeave } = this.props;
        return (
            <Box
                className={classes.buttonBar}
            >
                <Button
                    variant="outlined"
                    onClick={onRoomLeave}
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