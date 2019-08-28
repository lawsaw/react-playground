import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core';
import { RouteLink } from './';
import { ROUTES } from '../helpers/routes';

const StyledButton = withStyles(() => ({
    root: {
        width: '100%',
        color: 'green',
        '&$disabled': {
            //backgroundColor: 'rgba(0, 0, 0, 0.87)',
        },
    },
    disabled: {},
}))(Button);

export default () => {
    return (
        <Box>
            {
                ROUTES.map(({link, label}, index) => (
                    <ListItem key={index}>
                        <RouteLink to={link} label={label} component={StyledButton} />
                    </ListItem>
                ))
            }
        </Box>
    );
}
