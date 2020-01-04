import React, { PureComponent } from 'react';
import { withStyles, Box } from "@material-ui/core";

const styles = () => ({
    body: {

    },
});

class Body extends PureComponent {

    render() {
        const { classes } = this.props;
        return (
            <Box
                className={classes.body}
            >

            </Box>
        )
    }
}

export default withStyles(styles)(Body);