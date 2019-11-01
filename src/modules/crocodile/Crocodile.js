import React, { PureComponent, Fragment } from 'react';
import { withStyles, Grid } from "@material-ui/core";
import { Paint, Screen, Chat } from './';

const styles = () => ({
    wrap: {
        alignItems: 'flex-start',
        justifyContent: 'stretch',
    },
    wrapScreen: {},
    wrapChat: {
        flexGrow: 1,
        height: '100%',
    },
});

class Crocodile extends PureComponent {

    state = {
        image: '',
        chat: [
            {
                name: 'Alex',
                message: 'hz-hz',
            },{
                name: 'Preter',
                message: 'a doll??',
            },{
                name: 'Alex',
                message: 'hz-hz',
            },{
                name: 'Preter',
                message: 'a doll??',
            },{
                name: 'Alex',
                message: 'hz-hz',
            },{
                name: 'Preter',
                message: 'a doll??',
            },
        ],
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
        const { image, chat } = this.state;
        return (
            <Fragment>
                <Grid
                    container
                    spacing={1}
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
                        <Chat
                            chat={chat}
                        />
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