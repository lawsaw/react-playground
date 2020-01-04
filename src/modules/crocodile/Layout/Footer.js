import React, { PureComponent } from 'react';
import { withStyles, Box } from "@material-ui/core";

const styles = () => ({
    footer: {

    },
});

class Footer extends PureComponent {

    render() {
        const { classes } = this.props;
        return (
            <Box
                className={classes.footer}
            >

            </Box>
        )
    }
}

export default withStyles(styles)(Footer);