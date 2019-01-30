import React, { Component } from 'react';
import './Loading.scss';

class Loading extends Component {
  render() {
    return (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>);
  }
}

export default Loading;
