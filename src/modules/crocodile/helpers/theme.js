import { createMuiTheme } from '@material-ui/core/styles';
import { green, purple } from './palette';

const fontSize = 14; // It doesn't place style on html tag, but it have to, so I dublicated it in index.scss

const theme = createMuiTheme({
    // typography: {
    //     fontSize,
    //     pxToRem: size => `${(size / fontSize)}rem`,
    //     fontFamily: '"helveticaRoman", "sans-serif"',
    // },
    palette: {
        type: 'dark',
        // primary: {
        //     light: purple[300],
        //     main: purple[500],
        //     dark: purple[900],
        //     contrastText: '#fff',
        // },
        // secondary: {
        //     light: green[300],
        //     main: green[500],
        //     dark: green[900],
        //     contrastText: '#fff',
        // },
        // action: {
        //     hover: purple[50],
        //     //hoverOpacity: 0.5,
        //     //active: purple[100],
        // },
    },

});

export default theme;