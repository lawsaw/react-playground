import React, { PureComponent } from 'react';
import { withStyles, Box, AppBar, Toolbar, IconButton } from "@material-ui/core";
import { ColorPicker } from './';

const styles = () => ({
    toolbar: {

    },
});

const StyledAppBar = withStyles(() => ({

}))(AppBar);

class DeskToolbar extends PureComponent {
    render() {
        const { classes, onColorSelect } = this.props;
        return (
            <StyledAppBar
                className={classes.toolbar}
                position="static"
                color="default"
            >
                <Toolbar
                    variant="dense"
                >
                    <ColorPicker
                        onColorSelect={onColorSelect}
                    />
                   <IconButton>Redo</IconButton>
                </Toolbar>
            </StyledAppBar>
        )
    }
}

export default withStyles(styles)(DeskToolbar);