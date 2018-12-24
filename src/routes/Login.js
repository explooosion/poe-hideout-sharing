import React, { Component } from 'react';
import './Login.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MasterLayout from '../layout/MasterLayout';

class Login extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    const { counter } = this.props;
    this.state = {
      counter: counter,
    }
  }

  render() {
    return (
      <MasterLayout>
        <div className="login">
          <h1>
            Login
          </h1>
          <h2>{this.props.counter}</h2>
        </div>
      </MasterLayout>
    );
  }
}

Login.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(Login);
