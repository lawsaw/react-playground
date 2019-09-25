import React from 'react';
import { withStyles } from '@material-ui/core';
import GridMaterial from '@material-ui/core/Grid';
import { connect } from "react-redux";
import Typography from '@material-ui/core/Typography';

import { Set, Bar } from './';
import {add, del, update, done} from "./redux/actions";

const styles = (theme) => ({
    wrap: {
        margin: 0,
        height: '100%',
    },
    wrapHeader: {
        //padding: 0,
    },
    wrapBody: {
        //padding: 0,
        flexGrow: 1,
    },
    header: {},
    body: {},
    bord: {
        position: 'relative',
        width: '100%',
        height: '100%',
        margin: 0,
    },
    title: {
        marginBottom: 15,
    },
    section: {
        position: 'relative',
        flexBasis: '50%',
    },
});

const Title = (props) => {
    return (
        <Typography
            component='h3'
            variant='h3'
            className={props.className}
        >
            {props.children}
        </Typography>
    )
};

const Section = ({classes, ...props}) => {
    return (
        <GridMaterial
            item
            className={classes.section}
        >
            <Title
                className={classes.title}
            >
                {props.header}
            </Title>
            <Set
                data={props.data}
                update={props.update}
                done={props.done}
                del={props.del}
            />
        </GridMaterial>
    )
};

const Body = ({classes, ...props}) => {
    return (
        <GridMaterial
            container
            spacing={2}
            justify="space-between"
            wrap="nowrap"
            className={classes.bord}
        >
            <Section
                header="In process"
                data={props.listToDo}
                classes={classes}
                {...props}
            />
            <Section
                header="Done"
                data={props.listDone}
                classes={classes}
                {...props}
            />
        </GridMaterial>
    )
};

const Grid =  withStyles(styles)(({ classes, list, ...props }) => {
    let listToDo = list.filter(task => task.isDone !== true);
    let listDone = list.filter(task => task.isDone === true);
    return (
        <GridMaterial
            container
            spacing={2}
            direction="column"
            justify="flex-start"
            wrap="nowrap"
            className={classes.wrap}
        >
            <GridMaterial
                item
                className={classes.wrapHeader}
            >
                <Bar
                    total={list.length}
                    todo={listToDo.length}
                    done={listDone.length}
                    add={props.add}
                />
            </GridMaterial>
            <GridMaterial
                item
                className={classes.wrapBody}
            >
                <Body
                    classes={classes}
                    listToDo={listToDo}
                    listDone={listDone}
                    update={props.update}
                    done={props.setDoneStatus}
                    del={props.del}
                />
            </GridMaterial>

        </GridMaterial>
    );
});

export default connect(
    (store, props) => {
        return {
            list: store.list,
        }
    },
    dispatch => {
        return {
            update: props => dispatch(update(props)),
            add: props => dispatch(add(props)),
            del: props => dispatch(del(props)),
            setDoneStatus: props => dispatch(done(props)),
        }
    },
    null,
)(Grid);