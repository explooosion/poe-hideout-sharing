import React, { Component } from 'react';
import './Login.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaGooglePlusG } from 'react-icons/fa';
import { withNamespaces } from 'react-i18next';
import MasterLayout from '../layout/MasterLayout';
import Session from '../service/Session';

class Login extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.auth = props.auth;
    this.users = props.users;
    this.t = props.t;
  }

  async componentWillMount() {
    if (Session.get('auth-google') || Session.get('auth')) {
      // Google login susessful
      const userGoogle = this.users.getById(Session.get('auth-google').uid);
      if (!userGoogle) {
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
  }

  async signInByGoogle() {
    await this.auth.onSignInByGoogle();
    window.location.reload();
  }

  render() {
    return (
      <MasterLayout>
        <div className="login">
          <div className="login-form">
            <h1 className="login-title">{this.t('LoginTitle')}</h1>
            <div className="login-google" onClick={() => this.signInByGoogle()}>
              <FaGooglePlusG className="login-google-icon" />
              <span className="login-google-text">{this.t('LoginButton')}</span>
            </div>
          </div>
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

export default withNamespaces()(connect(mapStateToProps)(Login));
