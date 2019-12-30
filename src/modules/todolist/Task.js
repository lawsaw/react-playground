import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const styles = () => ({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

const FormItem = ({value, label, isEditable, toggleEditMode, onBlur, onChange, typographyProps}) => {
    return !isEditable ? (
        <Typography
            {...typographyProps}
            onDoubleClick={toggleEditMode}
        >
            {value}
        </Typography>
    ) : (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            margin="normal"
            variant="outlined"
            onBlur={onBlur}
            autoFocus={true}
        />
    )
};

export default withStyles(styles)(({ classes, id, title, description, isDone, update, done, del, ...props }) => {

    const [isTitleEdit, setIsTitleEdit] = useState(false);
    const [isDescriptionEdit, setIsDescriptionEdit] = useState(false);

    function toggleTitleEditMode() {
        setIsTitleEdit(!isTitleEdit);
    }

    function toggleDescriptionEditMode() {
        setIsDescriptionEdit(!isDescriptionEdit);
    }

    function saveData() {
        setIsTitleEdit(false);
        setIsDescriptionEdit(false);
        //console.log('save');
    }

    function updateValue(field) {
       return function(e) {
           if(e.target && e.target.value) {
               let { value } = e.target;
               update({
                   id,
                   field,
                   value,
               });
           }
       }
    }

    function handleDone() {
        done({id, status: !isDone})
    }

    function handleDelete() {
        del({id})
    }

    return (
        <Card className={classes.card}>
            <CardContent>

                <FormItem
                    value={title}
                    label="Title"
                    isEditable={isTitleEdit}
                    toggleEditMode={toggleTitleEditMode}
                    onBlur={saveData}
                    onChange={updateValue('title')}
                    typographyProps={{
                        gutterBottom: true,
                        variant: 'h5',
                        component: 'p'
                    }}
                />

                <FormItem
                    value={description}
                    label="Description"
                    isEditable={isDescriptionEdit}
                    toggleEditMode={toggleDescriptionEditMode}
                    onBlur={saveData}
                    onChange={updateValue('description')}
                    typographyProps={{
                        variant: 'body2',
                        color: 'textSecondary',
                        component: 'p'
                    }}
                />

            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={handleDone}>
                    {isDone ? 'UnDone' : 'Done'}
                </Button>
                <Button size="small" color="primary" onClick={handleDelete}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );

});