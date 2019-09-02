import React from 'react';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { Container } from './';

export default () => {

    return (
        <Provider store={store}>
            <Container />
        </Provider>
    );

};