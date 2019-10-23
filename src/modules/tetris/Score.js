import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import Box from "@material-ui/core/Box";

const styles = () => ({
    score: {
        fontSize: 40,
    },
});

class Score extends PureComponent {

    render() {
        const { classes, value } = this.props;
        return (
            <Box
                className={classes.score}
            >
                Score: {value}
            </Box>
        );
    }

};


export default withStyles(styles)(Score);