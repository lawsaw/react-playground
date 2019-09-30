import React, { Fragment } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { ROUTES } from '../helpers/routes';
import { MenuMain } from '../components';
import theme from '../helpers/theme';
import { IS_SINGLE_PAGE } from '../helpers/constants';

const styles = () => ({
    mainContainer: {
        height: '100%',
    },
    mainGrid: {
        height: '100%',
    },
    sidebar: {
        backgroundColor: '#282c34',
    },
    work: {
        position: 'relative',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default withStyles(styles)(({classes, ...props}) => {
    //console.log(props);
    return (
        <Fragment>
            <MuiThemeProvider
                theme={theme}
            >
                <CssBaseline />
                <Router>
                    <Container
                        className={classes.mainContainer}
                    >
                        <Grid
                            container
                            spacing={4}
                            className={classes.mainGrid}
                        >
                            {
                                !IS_SINGLE_PAGE && (
                                    <Grid
                                        item xs={2}
                                        className={classes.sidebar}
                                    >
                                        <MenuMain />
                                    </Grid>
                                )
                            }
                            <Grid
                                item xs={!IS_SINGLE_PAGE ? 10 : 12}
                                className={classes.work}
                            >
                                <Switch>
                                {
                                    ROUTES.map(({link, label, page}, index) => (
                                        <Route key={index} exact path={link} component={page} />
                                    ))
                                }
                                </Switch>
                            </Grid>



                        </Grid>
                    </Container>
                </Router>
            </MuiThemeProvider>
        </Fragment>
    );
});
