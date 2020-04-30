import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';

import Home from './routes/Home';
import Detail from './routes/Detail';
import Login from './routes/Login';
import Create from './routes/Create';
import Profile from './routes/Profile';

import { fetchHideouts, fetchUsers, LOGIN_GOOGLE } from './actions';

import { COOKIE_USER, COOKIE_CREDENTIAL, getCookie } from './utils/Cookie';

function App() {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const user = getCookie(COOKIE_USER);
    const credential = getCookie(COOKIE_CREDENTIAL);

    dispatch(fetchHideouts());
    dispatch(fetchUsers());

    if (auth.isLogin === false && user && credential) {
      dispatch({
        type: LOGIN_GOOGLE,
        payload: { credential, user },
      });
    }
  }, [dispatch, auth]);

  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          {auth.isLogin ? <Route exact path="/profile" component={Profile} /> : null}
          <Route exact path="/profile/:id" component={Profile} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/create" component={Create} />
          {auth.isLogin ? <Route exact path="/edit/:id" component={Create} /> : null}
          {auth.isLogin ? <Route exact path="/detail/:id" component={Detail} /> : null}
        </Switch>
      </div>
    </Router>
  );
}

export default App;

