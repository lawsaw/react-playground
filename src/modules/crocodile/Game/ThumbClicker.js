import React, { PureComponent, forwardRef } from 'react';
import cx from 'classnames';
import { withStyles, Paper, Grid } from "@material-ui/core";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbUp';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { THUMB_STATUS_LIKE, THUMB_STATUS_DISLIKE } from '../helpers/constants';

const styles = () => ({
    thumbClicker: {

    },
});

class ThumbClicker extends PureComponent {

    state = {
        value: null,
    }

    handleChange = (e, value) => {
        const { onClick } = this.props;
        this.setState(() => ({
            value,
        }));
        onClick(value);
    }

    render() {
        const { classes, className } = this.props;
        const { value } = this.state;
        return (
            <Grid
                container
                className={cx(classes.thumbClicker, className)}
            >
                <ToggleButtonGroup size="small" value={value} exclusive onChange={this.handleChange}>
                    <ToggleButton key={1} value={THUMB_STATUS_LIKE}>
                        <ThumbUpIcon />
                    </ToggleButton>
                    <ToggleButton key={2} value={THUMB_STATUS_DISLIKE}>
                        <ThumbDownIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
        )
    }
}

export default withStyles(styles)(ThumbClicker);

