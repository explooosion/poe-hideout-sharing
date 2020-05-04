import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Routes from './routes';

import Header from './components/Header';

import { fetchHideouts, fetchUsers, LOGIN_GOOGLE } from './actions';

import { COOKIE_USER, COOKIE_CREDENTIAL, getCookie } from './utils/Cookie';

function App() {
  const { isLogin } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const user = getCookie(COOKIE_USER);
    const credential = getCookie(COOKIE_CREDENTIAL);

    dispatch(fetchHideouts());
    dispatch(fetchUsers());

    if (isLogin === false && user && credential) {
      dispatch({
        type: LOGIN_GOOGLE,
        payload: { credential, user },
      });
    }
  }, [dispatch, isLogin]);

  const renderRoute = route => {
    const { key, path, exact, component: Component, title, auth } = route;
    if (auth === true && isLogin === false) {
      return null;
    } else {
      return (
        <Route
          key={key}
          exact={exact}
          path={path}
          component={Component}
          title={title}
        />
      );
    }
  }

  return (
    <Router>
      <div>
        <Header />
        <Switch>
          {Routes.map(renderRoute)}
        </Switch>
      </div>
    </Router>
  );
}

export default App;

