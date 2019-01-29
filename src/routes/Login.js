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

  componentWillMount() {
    if (Session.get('auth')) {
      // Login susessful
      const user = this.users.get().find(({ uid }) => uid === Session.get('auth').uid);
      // Check is new user
      if (!user) this.users.onCreateUser(Session.get('auth'));
      this.props.history.push('/');
    }
  }

  async signInByGoogle() {
    await this.auth.onSignInByGoogle();
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
