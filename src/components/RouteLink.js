import React from 'react';
import {
    Route,
    Link,
} from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({label, to, component}) => {
    return (
        <Route
            path={to}
            exact={true}
            children={({match}) => (
                React.createElement(
                    component || Button,
                    {
                        to,
                        disabled: Boolean(match),
                        component: Link,
                        children: label,
                    }
                )

            )}
        />
    );
}
