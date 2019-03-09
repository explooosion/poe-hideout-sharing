import React, { Component } from 'react';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

class Example extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
  }

  render() {
    return (
      <div>Example</div>
    );
  }
}

Example.propTypes = {}

const mapStateToProps = state => {
  return {
    // auth: state.auth,
    // users: state.users,
  }
}

export default withTranslation()(connect(mapStateToProps)(Example));
