import React, {PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles, Box } from "@material-ui/core";
import { leaveRoom } from '../helpers/socket';

const styles = (theme) => ({
    roomInfoBar: {
        position: 'relative',
        alignSelf: 'flex-start',
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    label: {
        flexBasis: 80,
    },
    value: {
        marginLeft: theme.spacing(2),
    },
});

class RoomInfoBar extends PureComponent {

    render() {
        const { classes, data } = this.props;

        return (
            <Box
                className={classes.roomInfoBar}
            >
                {
                    data.map(({ label, value }, index) => (label && value) ? (
                        <Box
                            key={index}
                            className={classes.item}
                        >
                            <Box
                                className={classes.label}
                                fontWeight="fontWeightMedium"
                            >
                                {label}:
                            </Box>
                            <Box
                                className={classes.value}
                            >
                                {value}
                            </Box>
                        </Box>
                    ) : null)
                }
            </Box>
        )
    }
}

export default connect(
    store => {
        return {
            socket: store.socket,
            room: store.room,
        }
    }
)(withStyles(styles)(RoomInfoBar));