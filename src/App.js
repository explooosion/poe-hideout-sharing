import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';

import Home from './routes/Home';
import Detail from './routes/Detail';
import Login from './routes/Login';
import Create from './routes/Create';
import Profile from './routes/Profile';

import { fetchHideouts, fetchUsers } from './actions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHideouts());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Router>
      <div>
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
    </Router>
  );
}

export default App;

