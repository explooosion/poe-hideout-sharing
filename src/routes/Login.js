import React, { useEffect } from 'react';
import './Login.scss';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaGooglePlusG } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import MasterLayout from '../layout/MasterLayout';

import { loginUser, LOGIN_GOOGLE } from '../actions';

import { COOKIE_USER, COOKIE_CREDENTIAL, getCookie } from '../utils/Cookie';

function Login() {
  const { t } = useTranslation();
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  const signInByGoogle = () => {
    dispatch(loginUser());
  }

  useEffect(() => {

    const user = getCookie(COOKIE_USER);
    const credential = getCookie(COOKIE_CREDENTIAL);

    if (auth.isLogin && user && credential) {
      console.log('login success');
      history.push('/');
    } else if (user && credential) {
      console.log('update redux');
      dispatch({
        type: LOGIN_GOOGLE,
        payload: { credential, user },
      });
    }
  });

  return (
    <MasterLayout>
      <div className="login">
        <div className="login-form">
          <h1 className="login-title">{t('LoginTitle')}</h1>
          <div className="login-google" onClick={() => signInByGoogle()}>
            <FaGooglePlusG className="login-google-icon" />
            <span className="login-google-text">{t('LoginButton')}</span>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}

export default Login;
