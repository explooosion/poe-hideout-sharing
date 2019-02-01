import React, { Component } from 'react';
import './App.scss';

import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './components/Header';
import Loading from './components/Animation/Loading';

import Home from './routes/Home';
import Detail from './routes/Detail';
import Login from './routes/Login';
import Create from './routes/Create';
import Profile from './routes/Profile';

import loading from './images/loading.gif';

class App extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.database = props.database;
    this.users = props.users;
    this.database.onHideoutsSnapshot();
    this.state = { time: 10 };
  }

  componentDidMount() {
    this.load = setInterval(() => {
      const l = this.state.time;
      if (l === 0) {
        clearInterval(this.load);
        return;
      }
      this.setState({ time: l - 1 })
    }, 1000);
  }

  render() {
    this.database = this.props.database;
    this.users = this.props.users;
    return (
      <Router>
        {
          /* Loading */
          (this.database.get().length > 0 && this.users.get().length > 0) || this.state.time === 0
            ? (
              <div>
                <Header />
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/profile/:id" component={Profile} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/create" component={Create} />
                  <Route exact path="/edit/:id" component={Create} />
                  <Route exact path="/detail/:id" component={Detail} />
                </Switch>
              </div>
            )
            : (
              <div className="loading-container">
                <img src={loading} alt="loading" title="loading" style={{ width: '250px', borderRadius: '.25rem' }} />
                <h1><Loading /></h1>
              </div>
            )
        }
      </Router>
    );
  }
}

App.propTypes = {}

const mapStateToProps = state => {
  return {
    database: state.database,
    users: state.users,
  }
}

export default connect(mapStateToProps)(App);
