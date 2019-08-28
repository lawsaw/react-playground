import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Content } from './';

const styles = () => ({
    contents: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
});

export default withStyles(styles)(({ classes, sizes, type, ...props }) => {
    console.log(sizes, type);
    let space = 0;
    return (
        <Fragment>
            <Box
                className={classes.contents}
            >
                {
                    sizes.map((size, index, arr) => {
                        space += !arr[index - 1] ? 0 : arr[index - 1];
                        return (
                            <Content
                                key={index}
                                size={size}
                                space={space}
                                type={type}
                                {...props}
                            />
                        )
                    })
                }
            </Box>
        </Fragment>

    );
});