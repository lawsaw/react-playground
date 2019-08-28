import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import { Main } from './containers';

function App() {
  return (
    <Router>
        <Route component={Main} />
    </Router>
  );
}

export default App;
