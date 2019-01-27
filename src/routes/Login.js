import React, { Component } from 'react';
import './Login.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaGooglePlusG } from 'react-icons/fa';
import { withNamespaces } from 'react-i18next';
import store from 'store2';
import MasterLayout from '../layout/MasterLayout';

class Login extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.auth = props.firebase.auth;
    this.t = props.t;
  }

  componentWillMount() {
    if (store.session('auth')) this.props.history.push('/');
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
    firebase: state.firebase,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Login));
