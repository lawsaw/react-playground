import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import socketIOClient from 'socket.io-client';
import { withSnackbar } from 'notistack';
import GridMaterial from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';


import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = () => ({
    stepper: {
        width: 300,
    },
    textFindHost: {
        display: 'flex',
        alignItems: 'center',
    },
    listOfClients: {

    },
    listOfClientsItem: {
        '&:not(:first-child)': {
            borderTop: '1px solid grey',
        }
    },
    loader: {
        display: 'block',
        margin: '10px auto',
    },
});

const STEPS = ['Your nickname', 'HOST or CLIENT?', ''];

class Lobby extends PureComponent {

    state = {
        host: '',
        activeStep: 0,

    }

    handleFriendIdChange = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            host: value,
        }))
    }

    handleBackStep = () => {
        const { activeStep } = this.state;
        this.setState(() => ({
            activeStep: activeStep - 1,
        }))
    }

    handleNextStep = () => {
        const { activeStep } = this.state;
        if(activeStep === 2) {
            this.handleFindHost();
        }
        if(activeStep < 2) {
            this.setState(() => ({
                activeStep: activeStep + 1,
            }))
        }
    }

    handleFindHost = () => {
        const { onHostFind } = this.props;
        const { host } = this.state;
        onHostFind(host);
    }

    renderStep = (step) => {
        const { classes, id, nickname, onFriendInvite, onNicknameChange, client, connectionType, onConnectionTypeChange } = this.props;
        const { host } = this.state;
        switch (step) {
            case 0:
                return (
                    <TextField
                        label="Enter your nickname"
                        margin="normal"
                        variant="outlined"
                        value={nickname}
                        onChange={onNicknameChange}
                    />
                )
                break;
            case 1:
                return (
                    <RadioGroup aria-label="position" name="position" value={connectionType} onChange={onConnectionTypeChange} row>
                        <FormControlLabel
                            value="host"
                            control={<Radio color="secondary" />}
                            label="I want to be HOST"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="client"
                            control={<Radio color="secondary" />}
                            label="I want to be CLIENT"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                )
                break;
            case 2:
                return (
                    <Fragment>
                        {
                            connectionType === 'host' ? (
                                <Fragment>
                                    Share your ID with your friend: <br/>
                                    <strong>{id}</strong> <br/>
                                </Fragment>
                            ) : (
                                <Box className={classes.textFindHost}>
                                    <TextField
                                        label="Enter HOST's ID:"
                                        margin="normal"
                                        variant="outlined"
                                        value={host}
                                        onChange={this.handleFriendIdChange}
                                    />
                                </Box>
                            )
                        }
                    </Fragment>
                )
                break;
            default:
                break;
        }
    }

    setFilledValue = (step) => {
        const { connectionType, nickname } = this.props;
        const { activeStep } = this.state;
        if(activeStep > step && step === 0) return `: ${nickname}`;
        if(activeStep > step && step === 1) return `: ${connectionType}`;
    }


    render() {
        const { classes, socket, id, onFriendInvite } = this.props;
        const { host, nickname, activeStep } = this.state;
        const handleFriendInvite = () => onFriendInvite(host, nickname);

        return (
            <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
                {
                    STEPS.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel>
                                    {label}
                                    {this.setFilledValue(index)}
                                </StepLabel>
                                <StepContent>
                                    {this.renderStep(index)}
                                    <Box>
                                        {
                                            activeStep > 0 ? (
                                                <Button
                                                    disabled={activeStep === 0}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleBackStep}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                            ) : null
                                        }
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleNextStep}
                                            className={classes.button}
                                        >
                                            Next
                                        </Button>
                                    </Box>
                                </StepContent>
                            </Step>
                        )
                    })
                }
            </Stepper>
        )



        // return (
        //     <GridMaterial container justify="flex-start" alignItems="center">
        //         <GridMaterial item xs={6}>
        //             {
        //                 id ? (
        //                     <Fragment>
        //                         Your ID is <br /><strong>{id}</strong>
        //                     </Fragment>
        //                 ) : (
        //                     <Fragment>
        //                         Loading socket...
        //                     </Fragment>
        //                 )
        //             }
        //         </GridMaterial>
        //         <GridMaterial item xs={6}>
        //             <TextField
        //                 label="Your nickname"
        //                 margin="normal"
        //                 variant="outlined"
        //                 value={nickname}
        //                 onChange={this.handleNicknameChange}
        //             />
        //             <TextField
        //                 label="Friend's ID"
        //                 margin="normal"
        //                 variant="outlined"
        //                 value={host}
        //                 onChange={this.handleFriendIdChange}
        //             />
        //             <IconButton onClick={handleFriendInvite} disabled={!host.length}>
        //                 <SendIcon />
        //             </IconButton>
        //         </GridMaterial>
        //     </GridMaterial>
        // );
    }

};


export default withStyles(styles)(Lobby);