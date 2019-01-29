import React, { Component } from 'react';
import './Step3.scss';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from 'primereact/button';

class Step3 extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps.state,
    }
  }

  render() {
    const { timer } = this.props;
    return (
      <div className="create-group">
        <h1 className="create-title">Publish!</h1>
        <div className="create-control">
          <Link to='/'>
            <Button
              label={`Finish (${this.state.finishTimer})`}
              className="p-button-raised create-control-button"
              onClick={(e) => clearInterval(timer)}
            />
          </Link>
        </div>
      </div>
    );
  }
}

Step3.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default withNamespaces()(connect(mapStateToProps)(Step3));
