import React, { PureComponent } from 'react';
import GridMaterial from '@material-ui/core/Grid';
import { ROWS, COLS } from './constants';
import { Score, Screen, Preview } from './';
import { generateGrid } from './etc';

const DEMO_TABLE = generateGrid(COLS, ROWS);
const DEMO_PREVIEW = generateGrid(3, 3);

class Friend extends PureComponent {

    render() {
        const { score, table, preview } = this.props;
        return (
            <GridMaterial container justify="center" spacing={5}>
                <GridMaterial item>
                    <Screen
                        table={table || DEMO_TABLE}
                    />
                </GridMaterial>
                <GridMaterial item>
                    <Preview table={preview || DEMO_PREVIEW} />
                    <Score value={score} />
                </GridMaterial>

            </GridMaterial>
        );
    }

};

export default Friend;