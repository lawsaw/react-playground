import React, { Fragment, useState } from 'react';
import cx from 'classnames';
import { AddModal } from './';
import { withStyles } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import Badge from '@material-ui/core/Badge';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

const styles = () => ({
    bar: {
        position: 'relative',
    },
    title: {
        flexGrow: 1,
    },
    margin: {
        marginLeft: 20,
    },
});

const Badges = [
    {
        label: 'Total',
        value: 'total',
    },{
        label: 'In process',
        value: 'todo',
    },{
        label: 'Done',
        value: 'done',
    }
];

export default withStyles(styles)(({ classes, ...props }) => {

    const [addModal, setAddModal] = useState(false);

    function handleOpenAddModal() {
        setAddModal(true);
    }

    function handleCloseAddModal() {
        setAddModal(false);
    }

    return (
        <Fragment>
            <AppBar position="static" className={classes.bar}>
                <Toolbar>
                    <Fab size="medium" color="secondary" aria-label="add" onClick={handleOpenAddModal}>
                        <AddIcon />
                    </Fab>
                    <Typography variant="h6" className={cx(classes.title, classes.margin)}>
                        To do list
                    </Typography>
                    {
                        Badges.map(({label, value}, index) => (
                            <Badge
                                key={index}
                                className={classes.margin}
                                badgeContent={`${props[value]}`}
                                color="secondary"
                            >
                                {label}
                            </Badge>
                        ))
                    }
                </Toolbar>
            </AppBar>
            <AddModal
                isOpen={addModal}
                onClose={handleCloseAddModal}
                add={props.add}
            />
        </Fragment>
    );
});