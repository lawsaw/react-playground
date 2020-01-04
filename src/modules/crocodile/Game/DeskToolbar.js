import React, { PureComponent } from 'react';
import { withStyles, Box, AppBar, Toolbar, IconButton, Slider as SliderMaterial } from "@material-ui/core";
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import Delete from '@material-ui/icons/Delete';
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
        padding: 0,
    },
    sizeSlider: {
        flexGrow: 1,
        marginLeft: 15,
    },
});

const StyledAppBar = withStyles(() => ({

}))(AppBar);

class DeskToolbar extends PureComponent {
    render() {
        const { classes, onColorSelect, onUndo, onRedo, onClear, onSizeChange, lineWidth } = this.props;
        return (
            <Toolbar
                variant="dense"
                className={classes.toolbar}
            >
                <ColorPicker
                    onColorSelect={onColorSelect}
                />
                <SliderMaterial
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
                <IconButton onClick={onUndo}><Undo /></IconButton>
                <IconButton onClick={onRedo}><Redo /></IconButton>
                <IconButton onClick={onClear}><Delete /></IconButton>
            </Toolbar>
        )
    }
}

export default withStyles(styles)(DeskToolbar);