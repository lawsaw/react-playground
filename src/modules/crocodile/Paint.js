import React, { PureComponent } from 'react';
import { withStyles, Box, Paper, Grid } from "@material-ui/core";
import { Desk, DeskToolbar } from './';

const styles = () => ({
    desk: {
        // width: 600,
        // height: 400,
    },
    toolbar: {
        flexGrow: 1,
    },
    screen: {},
});

class Paint extends PureComponent {

    state = {
        lineOptions: {
            lineWidth: 20,
            lineJoin: 'round',
            lineCap: 'round',
            strokeStyle: 'green',
        },
    }

    handlerDrawing = (props) => {
        const { onDrawing } = this.props;
        const { lineOptions } = this.state;
        onDrawing({lineOptions, ...props});
    }

    handlerColorSelect = (color) => {
        this.setState(state => ({
            lineOptions: {
                ...state.lineOptions,
                strokeStyle: color,
            }
        }));
    }

    render() {
        const { classes } = this.props;
        const { lineOptions } = this.state;
        return (
            <Grid
                container
                direction="column"
                spacing={1}
                className={classes.desk}
            >
                <Grid
                    item
                    className={classes.toolbar}
                >
                    <DeskToolbar
                        onColorSelect={this.handlerColorSelect}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.screen}
                >
                    <Desk
                        onDrawing={this.handlerDrawing}
                        lineOptions={lineOptions}
                    />
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Paint);