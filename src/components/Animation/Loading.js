import React, { Component } from 'react';
import './Loading.scss';
import { connect } from 'react-redux';

class Loading extends Component {
  render() {
    return (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>);
  }
}

Loading.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(Loading);
