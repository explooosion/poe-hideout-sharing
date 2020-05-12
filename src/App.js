import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import Routes from './routes';

import Header from './components/Header';
import Loading from './components/Animation/Loading';

import { fetchHideouts, fetchUsers, LOGIN_GOOGLE } from './actions';

import { COOKIE_USER, COOKIE_CREDENTIAL, getCookie } from './utils/Cookie';

import loading from './images/loading.gif';

const Load = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url('./images/loading.jpg');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100%;
  background-color: #000;

  img {
    width: 250px;
    border-radius: .25rem;
  }

  h1 {
    display: flex;
    align-items: center;
    margin-top: 1.5rem;
    color: #fff;

    &::before {
      content: 'Loading';
      padding-right: 1rem;
      font-family: Lobster Two, cursive;
    }
  }
`;

function App() {
  const { isLogin } = useSelector(state => state.auth);
  const { hideouts, users } = useSelector(state => state.firebase);
  const { t } = useTranslation();
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
    const prefixLine = path === '/' ? '' : ' - ';
    const prefixTitle = 'POEHos';

    if (auth === true && isLogin === false) {
      return null;
    } else {
      return (
        <Route
          key={key}
          exact={exact}
          path={path}
          title={title}
          render={props => (
            <div>
              <Helmet>
                <title>{prefixTitle}{prefixLine}{t(title)}</title>
              </Helmet>
              <Component {...props} />
            </div>
          )}
        />
      );
    }
  }

  if (hideouts.length > 0 && users.length > 0) {
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
  } else {
    return (
      <Load>
        <img src={loading} alt="loading" title="loading" />
        <h1><Loading /></h1>
      </Load>
    )
  }
}

export default App;

