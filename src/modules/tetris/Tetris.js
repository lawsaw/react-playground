import React, { Component } from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { Body } from './';

export default class extends Component {

    render() {
        return (
            <Provider store={store}>
                <SnackbarProvider maxSnack={3} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                    <Body />
                </SnackbarProvider>
            </Provider>
        );
    }

};
