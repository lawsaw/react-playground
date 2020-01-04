import React, { PureComponent } from 'react';
import { withStyles, Box } from "@material-ui/core";
import { GithubPicker } from 'react-color';

// const COLORS = [
//     '#ff00ff',
//     '#ff0000',
//     '#00ff00',
//     '#0000ff',
// ];

const COLORS = [
    '#B80000',
    '#DB3E00',
    '#FCCB00',
    '#008B02',
    '#006B76',
    '#1273DE',
    '#004DCF',
    '#5300EB',
    '#EB9694',
    '#FAD0C3',
    '#FEF3BD',
    '#C1E1C5',
    '#BEDADC',
    '#C4DEF6',
    '#BED3F3',
    '#D4C4FB'
];

const styles = () => ({
    color: {
        flexGrow: 1,
    },
    picker: {
        background: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
        padding: '0 !important',
    },
});

class ColorPicker extends PureComponent {

    handleChange = (color, e) => {
        //console.log({color, e});
        const { onColorSelect } = this.props;
        if(onColorSelect) onColorSelect(color.hex);
    }

    render() {
        const { classes } = this.props;
        return (
            <Box
                className={classes.color}
            >
                <GithubPicker
                    color="#ff00ff"
                    onChange={this.handleChange}
                    triangle="hide"
                    colors={COLORS}
                    className={classes.picker}
                />
                {/*{*/}
                {/*    COLORS.map((color, index) => {*/}
                {/*        return (*/}
                {/*            <IconButton*/}
                {/*                key={index}*/}
                {/*                className={classes.button}*/}
                {/*                style={{*/}
                {/*                    backgroundColor: color,*/}
                {/*                }}*/}
                {/*                onClick={() => this.handlerClick(color)}*/}
                {/*            >*/}

                {/*            </IconButton>*/}
                {/*        )*/}
                {/*    })*/}
                {/*}*/}
            </Box>
        )
    }
}

export default withStyles(styles)(ColorPicker);