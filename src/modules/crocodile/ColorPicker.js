import React, { PureComponent } from 'react';
import { withStyles, Box, AppBar, Toolbar, IconButton } from "@material-ui/core";

const COLORS = [
    '#ff00ff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
];

const styles = () => ({
    colorPicker: {

    },
    button: {

    },
});

class ColorPicker extends PureComponent {

    handlerClick = (color) => {
        const { onColorSelect } = this.props;
        if(onColorSelect) onColorSelect(color);
    }

    render() {
        const { classes } = this.props;
        return (
            <Box
                className={classes.colorPicker}
            >
                {
                    COLORS.map((color, index) => {
                        return (
                            <IconButton
                                key={index}
                                className={classes.button}
                                style={{
                                    backgroundColor: color,
                                }}
                                onClick={() => this.handlerClick(color)}
                            >

                            </IconButton>
                        )
                    })
                }
            </Box>
        )
    }
}

export default withStyles(styles)(ColorPicker);