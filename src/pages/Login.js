import React, { useEffect } from 'react';
import styled from 'styled-components';
import { rgba, lighten, transitions } from 'polished';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGooglePlusG } from 'react-icons/fa';

import { Growl } from 'primereact/growl';

import MasterLayout from '../layout/MasterLayout';

import { loginUser, LOGIN_GOOGLE } from '../actions';

import { COOKIE_USER, COOKIE_CREDENTIAL, getCookie } from '../utils/Cookie';

import bg from '../images/bg.jpg';

const Main = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: calc(100vh - ${p => p.theme.headerHeight});
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  background-attachment: fixed;
`;

const Form = styled.div`
  margin-top: 5rem;
  width: 500px;
  height: 230px;
  text-align: center;
  background-color: ${p => rgba(p.theme.dark, .85)};
  border: 2px solid ${p => p.theme.gray};
`;

const Title = styled.h1`
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  color: #fff;
  border-bottom: 1px solid ${p => p.theme.gray};
  font-family: ${p => p.theme.headerFont};
`;

const Button = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 1rem;
  width: 350px;
  color: #fff;
  background-color: ${p => p.theme.dangerGoogle};
  font-family: ${p => p.theme.headerFont};
  cursor: pointer;
  user-select: none;
  ${transitions(['background-color'], '.2s ease-in-out')};

  &:hover {
    background-color: ${p => lighten(0.2, p.theme.dangerGoogle)};
  }

  svg {
    position: absolute;
    left: 15px;
    font-size: 3rem;
  }

  span {
    display: inline-block;
    margin: 0 auto 0 80px;
    font-size: 1.4rem;
    font-weight: bold;
  }
`;

let growl;

function Login() {
  const { t } = useTranslation();
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  const signInByGoogle = async () => {
    const result = await dispatch(loginUser());
    if (!result) {
      growl.show({ severity: 'error', summary: 'Login Failed', detail: 'Google authentication fails.' });
    }
  }

  useEffect(() => {
    const user = getCookie(COOKIE_USER);
    const credential = getCookie(COOKIE_CREDENTIAL);

    if (auth.isLogin && user && credential) {
      console.log('login success');
      history.goBack();
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
      <Main>
        <Form>
          <Title>{t('LoginTitle')}</Title>
          <Button onClick={() => signInByGoogle()}>
            <FaGooglePlusG />
            <span>{t('LoginButton')}</span>
          </Button>
        </Form>
      </Main>
      <Growl ref={el => growl = el} />
    </MasterLayout>
  );
}

export default Login;
