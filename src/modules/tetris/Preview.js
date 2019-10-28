import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { COL_SIZE } from './constants';
import { Grid } from './';

const styles = () => ({
    preview: {
        width: COL_SIZE*4,
        height: COL_SIZE*4,
    },
});

class Preview extends PureComponent {

    render() {
        const { classes, ...props } = this.props;
        return (
            <Box
                className={classes.preview}
            >
                <Grid
                    isPreview
                    {...props}
                />
            </Box>
        );
    }

};

export default withStyles(styles)(Preview);