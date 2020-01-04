import React, { PureComponent } from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, ThemeProvider } from '@material-ui/core/styles';
import Main from './Main';
import THEME from './helpers/theme';
import mainReducer from './reducers';

const store = createStore(
    mainReducer
);

class Crocodile extends PureComponent {

    render() {
        return (
            <Provider
                store={store}
            >
                <SnackbarProvider maxSnack={3} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                    <MuiThemeProvider
                        theme={THEME}
                    >
                        <CssBaseline />
                        <Main />
                    </MuiThemeProvider>
                </SnackbarProvider>
            </Provider>
        )
    }

}

export default Crocodile;