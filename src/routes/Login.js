import React, { Component } from 'react';
import './Login.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaGooglePlusG } from 'react-icons/fa';
import { withTranslation } from 'react-i18next';
import MasterLayout from '../layout/MasterLayout';
import Session from '../service/Session';

class Login extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.auth = props.auth;
    this.users = props.users;
    this.t = props.t;
    this.isCheckOk = false;
  }

  async onCheckAuth() {
    if (Session.get('auth-google') || Session.get('auth')) {
      // Google login susessful
      if (!Session.get('auth')) {
        // New user
        await this.users.onCreateUser(Session.get('auth-google'));
      }
      else if (Object.keys(this.users.getById(Session.get('auth').uid).length === 0)) {
        // New user
        await this.users.onCreateUser(Session.get('auth-google'));
      } else {
        // Old user
        const user = this.users.getById(Session.get('auth').uid);
        Session.set(user);
      }
      // Not login in google
      this.props.history.push('/');
    }
    this.isCheckOk = Session.get('auth-google') ? false : true;
  }

  async signInByGoogle() {
    await this.auth.onSignInByGoogle();
    this.onCheckAuth();
    this.props.history.push('/');
  }

  render() {
    // Before render, should wait for loading users data
    this.users = this.props.users;
    if (this.users.get().length > 0) this.onCheckAuth();

    return (
      <MasterLayout>
        <div className="login">
          {
            this.isCheckOk ?
              (
                <div className="login-form">
                  <h1 className="login-title">{this.t('LoginTitle')}</h1>
                  <div className="login-google" onClick={() => this.signInByGoogle()}>
                    <FaGooglePlusG className="login-google-icon" />
                    <span className="login-google-text">{this.t('LoginButton')}</span>
                  </div>
                </div>
              ) : null
          }
        </div>
      </MasterLayout>
    );
  }
}

Login.propTypes = {}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    users: state.users,
  }
}

export default withTranslation()(connect(mapStateToProps)(Login));
