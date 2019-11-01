import React, { PureComponent, createRef } from 'react';
import { isEqual } from 'lodash';
import { withStyles, Paper, TextField, Grid, IconButton, InputBase, Box, Card, CardContent, Typography } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { DESK_WIDTH, DESK_HEIGHT } from './constants';
import { getHeightFromWidth } from '../../helpers/etc';

const styles = (theme) => ({
    wrap: {
       position: 'relative',
        height: '100%',
    },
    wrapMessages: {
        position: 'relative',
        flexGrow: 1,
    },
    wrapMessage: {

    },
    textField: {
        width: '100%',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        flex: 1,
    },
    chatWindow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowX: 'hidden',
        overflowY: 'scroll',
    },
    card: {
        margin: theme.spacing(1),
    },
    name: {
        textAlign: 'right',
    },
    message: {},
});

class Chat extends PureComponent {

    render() {
        const { classes, chat } = this.props;
        return (
            <Grid
                container
                spacing={1}
                direction="column"
                className={classes.wrap}
            >
                <Grid
                    item
                    className={classes.wrapMessages}
                >
                    <Paper
                        elevation={5}
                        square={true}
                        className={classes.chatWindow}
                    >
                        {
                           chat.map(({name, message}, index) => (
                               <Card
                                   key={index}
                                   className={classes.card}
                               >
                                    <CardContent>
                                        <Typography className={classes.name} variant="h5" component="h2">{name || 'Default Name'}</Typography>
                                        <Typography className={classes.message} variant="body2" component="p">{message}</Typography>
                                    </CardContent>
                               </Card>
                           ))
                        }
                    </Paper>
                </Grid>
                <Grid
                    item
                    className={classes.wrapMessage}
                >
                    <Paper
                        elevation={5}
                        className={classes.textField}
                    >
                        <InputBase
                            className={classes.input}
                            placeholder="Enter your variant"
                        />
                        <IconButton className={classes.iconButton}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Chat);