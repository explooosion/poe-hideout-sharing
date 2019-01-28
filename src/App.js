import React, { Component } from 'react';
import './App.scss';

import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './components/Header';

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
    this.database = this.props.firebase.database;
    this.database.onHideoutsSnapshot(this.dispatch);
  }

  render() {
    return (
      <Router>
        {
          /* Loading */
          this.database.hideouts.length > 0
            ? (
              <div>
                <Header />
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/profile" component={Profile} />
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
                <h1><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></h1>
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
    hideouts: state.hideouts,
    firebase: state.firebase,
  }
}

// export default withNamespaces()(connect(mapStateToProps)(App));
export default connect(mapStateToProps)(App);
