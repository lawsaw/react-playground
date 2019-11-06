import React, { PureComponent, Fragment } from 'react';
import { withStyles, Paper, IconButton, InputBase, Box, List, ListItem, ListItemText, Divider, Grid, Dialog } from "@material-ui/core";
import { Send, Add } from '@material-ui/icons';

const styles = (theme) => ({
    lobby: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: theme.palette.green[100],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lobbyContent: {
        position: 'relative',
    },
    root: {

    },
    form: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 250,
    },
    input: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    iconButton: {
        padding: 20,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    stepTitle: {
        fontSize: theme.typography.pxToRem(30),
        margin: '20px 0',
    },
    list: {
        width: 350,
    },

});

class Lobby extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isCreateNewRoomModal: false,
            newRoomName: '',
        };
    }

    renderNameInput = (onChange, onSubmit, placeholder, value) => {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <form
                    className={classes.form}
                    onSubmit={onSubmit}
                >
                    <InputBase
                        className={classes.input}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        autoFocus
                    />
                    <IconButton
                        className={classes.iconButton}
                        onClick={onSubmit}
                    >
                        <Send />
                    </IconButton>
                </form>
            </Paper>
        );
    }

    handleNewRoomChange = (e) => {
        const { value } = e.target;
        this.setState(state => ({
            newRoomName: value,
        }));
    }

    handleCreateNewRoomModalOpen = () => {
        this.setState(() => ({
            isCreateNewRoomModal: true,
        }));
    }

    handleCreateNewRoomModalClose = () => {
        this.setState(() => ({
            isCreateNewRoomModal: false,
            newRoomName: '',
        }));
    }

    renderRoomSelect = () => {
        const { classes, roomList, onNewRoomSubmit, onRoomSelect } = this.props;
        const { isCreateNewRoomModal, newRoomName } = this.state;
        console.log(roomList);
        return (
            <Fragment>
                <Box className={classes.stepTitle} >Select room or create new one: </Box>
                <Grid
                    container
                >
                    <Grid
                        item
                    >
                        <IconButton
                            className={classes.iconButton}
                            onClick={this.handleCreateNewRoomModalOpen}
                        >
                            <Add />
                        </IconButton>
                    </Grid>
                    <Grid
                        item
                    >
                        <Paper>
                            <List component="nav" className={classes.list}>
                                {
                                    roomList.map(({ room, players }, index) => {
                                        return (
                                            <Fragment
                                                key={room}
                                            >
                                                <ListItem
                                                    button
                                                    onClick={() => onRoomSelect(room)}
                                                >
                                                    <ListItemText primary={room} />
                                                    <Box>({players})</Box>
                                                </ListItem>
                                                {
                                                    index !== (roomList.length - 1) ? <Divider /> : null
                                                }
                                            </Fragment>
                                        )
                                    })
                                }
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog
                    open={isCreateNewRoomModal}
                    onClose={this.handleCreateNewRoomModalClose}
                >
                    {
                        this.renderNameInput(this.handleNewRoomChange, e => onNewRoomSubmit(e, newRoomName), 'Enter new room name', newRoomName )
                    }
                </Dialog>
            </Fragment>
        )
    }

    renderStep = (step) => {
        const { onNicknameChange, onNicknameSubmit, user } = this.props;
        let Page = null;
        switch (step) {
            case 1:
                Page = this.renderNameInput(onNicknameChange, onNicknameSubmit, 'Enter your nickname', user.nickname || '' );
                break;
            case 2:
                Page = this.renderRoomSelect();
                break;
        }
        return Page;
    }

    render() {
        const { classes, lobbyStep } = this.props;
        console.log(lobbyStep);
        const Step = this.renderStep(lobbyStep);
        return (
            <Box
                className={classes.lobby}
            >
                <Box
                    className={classes.lobbyContent}
                >
                    {Step}
                </Box>
            </Box>
        )
    }
}

export default withStyles(styles)(Lobby);