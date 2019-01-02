import React, { Component } from 'react';
import './DetailMenu.scss';

import { connect } from 'react-redux';

import MenuLayout from '../layout/MenuLayout';

import NumberFormat from 'react-number-format';

class DetailMenu extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.state = {
      hideout: props.hideout,
      title: 'Hideout Detail',
    };
  }

  render() {
    const { author, type, favour, version, update, create } = this.state.hideout;
    return (
      <MenuLayout title={this.state.title}>
        <div className="list">
          <div className="item">
            <h4 className="item-title">Hideout Type</h4>
            <h4 className="item-value">{type} Hideout</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Total Favor</h4>
            <h4 className="item-value">
              <NumberFormat value={favour} displayType={'text'} thousandSeparator={true} />
            </h4>
          </div>
          <div className="item">
            <h4 className="item-title">Author</h4>
            <h4 className="item-value">{author}</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Version</h4>
            <h4 className="item-value">{version}</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Update</h4>
            <h4 className="item-value">{update}</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Create</h4>
            <h4 className="item-value">{create}</h4>
          </div>
        </div>
      </MenuLayout>
    );
  }
}

DetailMenu.propTypes = {}

const mapStateToProps = state => {
  return {
    hideouts: state.hideouts,
  }
}

export default connect(mapStateToProps)(DetailMenu);
