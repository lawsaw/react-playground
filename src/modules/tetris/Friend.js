import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import GridMaterial from '@material-ui/core/Grid';
import { FIGURES, ROTATION_CIRCLE, ROWS, COLS, POSITION, COL_SIZE, ROWS_HIDDEN, SPEED } from './constants';
import { Score, Screen } from './';
import { generateGrid, merge, renderDemoHouse } from './etc';

const styles = () => ({

});

const DEMO_TABLE = generateGrid(COLS, ROWS);

class Friend extends PureComponent {

    render() {
        const { score, table } = this.props;
        return (
            <GridMaterial container justify="center" spacing={5}>
                <GridMaterial item>
                    <Screen
                        table={table || DEMO_TABLE}
                    />
                </GridMaterial>
                <GridMaterial item>
                    <Score value={score} />
                </GridMaterial>

            </GridMaterial>
        );
    }

};


export default withStyles(styles)(Friend);