import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid } from "@material-ui/core";
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
        image: '',
    }

    handleConvertToImage = (canvas) => {
        if(canvas) {
            let image = canvas.current.toDataURL();
            this.setState(() => ({
                image,
            }));
        }
    }

    render() {
        const { classes } = this.props;
        const { image } = this.state;
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
                            onConvertToImage={this.handleConvertToImage}
                        />
                    </Grid>
                    <Grid
                        item
                        className={classes.wrapChat}
                    >
                        Chat
                    </Grid>
                </Grid>
                <Screen
                    image={image}
                />
            </Fragment>

        )
    }
}

export default withStyles(styles)(Crocodile);