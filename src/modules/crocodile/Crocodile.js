import React, { PureComponent, Fragment } from 'react';
import { withStyles, makeStyles, Grid } from "@material-ui/core";
import { Paint, Screen } from './';

const styles = () => ({
    wrap: {
        alignItems: 'flex-start',
        justifyContent: 'stretch',
    },
    wrapScreen: {},
    wrapChat: {
        flexGrow: 1,
    },
});

class Crocodile extends PureComponent {

    state = {
        paint: {},
    }

    handlerDrawing = (args) => {
        //console.log(args);
        this.setState(() => ({
            paint: {...args},
        }));
    }

    render() {
        const { classes } = this.props;
        const { paint } = this.state;
        return (
            <Fragment>
                <Grid
                    container
                    className={classes.wrap}
                >
                    <Grid
                        item
                        className={classes.wrapScreen}
                    >
                        <Paint
                            onDrawing={this.handlerDrawing}
                        />
                    </Grid>
                    <Grid
                        item
                        className={classes.wrapChat}
                    >
                        Chat
                    </Grid>
                </Grid>
                <Screen {...paint} />
            </Fragment>

        )
    }
}

export default withStyles(styles)(Crocodile);