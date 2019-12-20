import React, { PureComponent } from 'react';
import { SnackbarProvider } from 'notistack';
import { Body } from './';


class Crocodile extends PureComponent {

    render() {
        return (
            <SnackbarProvider maxSnack={3} anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}>
                <Body />
            </SnackbarProvider>
        )
    }

}

export default Crocodile;