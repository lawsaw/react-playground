import React, { PureComponent, createRef, cloneElement } from 'react';
import cx from 'classnames';
import { withStyles, Box } from "@material-ui/core";

const styles = theme => ({
    resizer: {
        position: 'absolute',
    },
});

class Resizer extends PureComponent {

    constructor(props) {
        super(props);
        this.ref = createRef();
        this.state = {
            style: {
                width: '100%',
                height: '100%',
            },
        }
    }

    componentDidMount() {
        this.setSize();
        setTimeout(() => {
            this.setSize();
        }, 200);
        window.addEventListener('resize', this.setSize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setSize, false);
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(this.state.offsetHeight < 25) this.setSize();
    // }

    setSize = () => {
        const { k, theme } = this.props;
        let { offsetWidth, offsetHeight, parentElement: { offsetWidth: parentOffsetWidth, offsetHeight: parentOffsetHeight } } = this.ref.current;
        let width = offsetHeight / k;
        let height = offsetWidth * k;
        let spacing = theme.spacing(2);
        let style = parentOffsetWidth < parentOffsetHeight ? {
            height: height > parentOffsetHeight ? parentOffsetHeight : height,
            width: `calc(100% - ${spacing}px)`,
            maxHeight: `calc(100% - ${spacing}px)`,
            maxWidth: parentOffsetHeight/k - spacing,
        } : parentOffsetWidth > parentOffsetHeight ? {
            width: width > parentOffsetWidth ? parentOffsetWidth : width,
            height: `calc(100% - ${spacing}px)`,
            maxWidth: `calc(100% - ${spacing}px)`,
            maxHeight: parentOffsetWidth*k - spacing,
        } : {
            width,
            height,
            maxWidth: parentOffsetHeight/k,
            maxHeight: parentOffsetWidth*k,
        };
        let [canvasWidth, canvasHeight] = parentOffsetWidth < parentOffsetHeight ? [
            width,
            height > parentOffsetHeight ? (parentOffsetHeight - spacing) : height
        ] : parentOffsetWidth > parentOffsetHeight ? [
            width > parentOffsetWidth ? (parentOffsetWidth - spacing) : width,
            height,
        ] : [
            width,
            height
        ];

        // console.log({
        //     height1: height > parentOffsetHeight ? parentOffsetHeight : height,
        //     width1: parentOffsetHeight/k - spacing,
        //     height2: parentOffsetWidth*k - spacing,
        //     width2: width > parentOffsetWidth ? parentOffsetWidth : width,
        //     height,
        //     width,
        //     canvasWidth, canvasHeight
        // });
        this.setState(() => ({
            style,
            canvasWidth,
            canvasHeight,
        }));
    }

    updateChildren = () => {
        const { children } = this.props;
        const { canvasWidth, canvasHeight } = this.state;
        return cloneElement(
            children,
            {
                resizer: {
                    width: canvasWidth,
                    height: canvasHeight,
                },
            },
        );
    }

    render() {
        const { classes, className, children } = this.props;
        const { style } = this.state;
        //console.log(this.state);
        return (
            <Box
                className={cx(classes.resizer, className)}
                ref={this.ref}
                style={style}
            >
                {this.updateChildren()}
            </Box>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Resizer);