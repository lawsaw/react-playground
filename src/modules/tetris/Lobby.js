import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
        const { classes, id, nickname, onNicknameChange, connectionType, onConnectionTypeChange } = this.props;
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
                );
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
                );
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
                );
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
        const { classes, connectionType } = this.props;
        const { activeStep } = this.state;
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
                                        {
                                            !(activeStep === 2 && connectionType === 'host') ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleNextStep}
                                                    className={classes.button}
                                                >
                                                    Next
                                                </Button>
                                            ) : null
                                        }
                                    </Box>
                                </StepContent>
                            </Step>
                        )
                    })
                }
            </Stepper>
        )

    }

};


export default withStyles(styles)(Lobby);