import React from 'react';
import GridMaterial from '@material-ui/core/Grid';
import { Task } from './';
import { withStyles } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = () => ({
    grid: {
        position: 'relative',
    },
    empty: {
        padding: 10,
        width: '100%',
    },
});

export default withStyles(styles)(({ classes, data, update, done, del }) => {
    return (
        <GridMaterial
            container
            spacing={2}
            className={classes.grid}
        >
            {
                data && data.length ? data.map(({id, isDone, title, description}) => {
                    return(
                        <GridMaterial
                            key={id}
                            item
                        >
                            <Task
                                isDone={isDone}
                                id={id}
                                title={title}
                                description={description}
                                update={update}
                                done={done}
                                del={del}
                            />
                        </GridMaterial>
                    )
                }) : (
                    <Paper className={classes.empty}>
                        <Typography component="p">
                            There is no data
                        </Typography>
                    </Paper>
                )
            }
        </GridMaterial>
    );
});