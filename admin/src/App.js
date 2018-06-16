import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Dashboard from './routes/Dashboard';
import Games from './routes/Games';
import Players from './routes/Players';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="root">

          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/players">Players</Link>
            <Link to="/games">Games</Link>
          </nav>

          <main>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/players" component={Players} />
            <Route exact path="/games" component={Games} />
          </main>

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
