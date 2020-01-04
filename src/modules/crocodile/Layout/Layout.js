import React, {Fragment, PureComponent} from 'react';
import { withStyles, Box } from "@material-ui/core";
import { Lobby } from '../Lobby';
import { Header, Footer } from './';
import { GameInterface } from "../Game";

const styles = () => ({
    layout: {
        backgroundColor: '#191922',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    header: {
        backgroundColor: '#121216',
        //height: 50,
    },
    body: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
    footer: {
        backgroundColor: '#121216',
        height: 25,
    },
});

class Layout extends PureComponent {

    render() {
        const { classes, isConnected, isLobby } = this.props;
        return (
            <Box
                className={classes.layout}
            >
                {
                    !isLobby ? (
                        <Box className={classes.header}>
                            <Header />
                        </Box>
                    ) : null
                }
                <Box className={classes.body}>
                    {
                        isConnected ? (
                            <Fragment>
                                {
                                    isLobby ? (
                                        <Lobby />
                                    ) : (
                                        <GameInterface />
                                    )
                                }
                            </Fragment>
                        ) : (
                            <Fragment>
                                Not connected
                            </Fragment>
                        )
                    }
                </Box>
                {/*<Box className={classes.footer}>*/}
                {/*    <Footer />*/}
                {/*</Box>*/}
            </Box>
        )
    }
}

export default withStyles(styles)(Layout);