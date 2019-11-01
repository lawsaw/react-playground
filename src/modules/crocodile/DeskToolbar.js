import React, { PureComponent } from 'react';
import { withStyles, Box, AppBar, Toolbar, IconButton, Slider } from "@material-ui/core";
import { ColorPicker } from './';

const marks = [
    {
        value: 0,
        label: '0°C',
    },
    {
        value: 20,
        label: '20°C',
    },
    {
        value: 37,
        label: '37°C',
    },
    {
        value: 100,
        label: '100°C',
    },
];

function valuetext(value) {
    return `${value} пизда`;
}

const styles = () => ({
    toolbar: {

    },
    sizeSlider: {
        width: 150,
    },
});

const StyledAppBar = withStyles(() => ({

}))(AppBar);

class DeskToolbar extends PureComponent {
    render() {
        const { classes, onColorSelect, onUndo, onRedo, onSizeChange, lineWidth } = this.props;
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
                   <IconButton onClick={onUndo}>Undo</IconButton>
                   <IconButton onClick={onRedo}>Redo</IconButton>
                    <Slider
                        value={lineWidth}
                        onChange={onSizeChange}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={100}
                        className={classes.sizeSlider}
                    />
                </Toolbar>
            </StyledAppBar>
        )
    }
}

export default withStyles(styles)(DeskToolbar);