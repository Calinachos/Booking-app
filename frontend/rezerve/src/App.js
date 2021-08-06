import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Views from './views';
import './App.css';
import "antd/dist/antd.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={Views} />
        </Switch>
      </Router>

    </div>
  );
}

export default App;
