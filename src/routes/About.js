import React, { Component } from 'react';
import './About.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { increaseCounter } from '../actions';

import MasterLayout from '../layout/MasterLayout';

class About extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  render() {
    return (
      <MasterLayout>
        <div className="about">
          <h1
            onClick={e => {
              this.dispatch(increaseCounter(1));
            }}
          >
            About
          </h1>
          <h2>{this.props.counter}</h2>
        </div>
      </MasterLayout>
    );
  }
}

About.propTypes = {}

const mapStateToProps = state => {
  return {
    counter: state.counter,
  }
}

export default connect(mapStateToProps)(About);
