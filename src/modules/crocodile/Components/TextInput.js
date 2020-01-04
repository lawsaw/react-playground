import React, { PureComponent } from 'react';
import cx from 'classnames';
import { withStyles, Paper, InputBase, IconButton } from "@material-ui/core";
import { Send } from '@material-ui/icons';

const styles = (theme) => ({
    root: {
       position: 'relative',
    },
    input: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    iconButton: {
        //padding: 20,
    },
    form: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
});

class TextInput extends PureComponent {

    // constructor(props) {
    //     super(props);
    //     this.lockFunc = lockFunc();
    // }

    handleSubmit = (e) => {
        const { onSubmit } = this.props;
        e.preventDefault();
        onSubmit(e)
    }

    render() {
        const { classes, onChange, placeholder, value, className, ...props } = this.props;
        return (
            <Paper
                className={cx(classes.root, className)}
                square={true}
                {...props}
            >
                <form
                    className={classes.form}
                    onSubmit={this.handleSubmit}
                >
                    <InputBase
                        className={classes.input}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        autoFocus
                    />
                    <IconButton
                        className={classes.iconButton}
                        onClick={this.handleSubmit}
                    >
                        <Send />
                    </IconButton>
                </form>
            </Paper>
        )
    }
}

export default withStyles(styles)(TextInput);