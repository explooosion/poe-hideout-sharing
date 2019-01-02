import React, { Component } from 'react';
import './DetailMenu.scss';

import { FaCubes } from 'react-icons/fa';

import MenuLayout from '../layout/MenuLayout';

class DetailMenu extends Component {

  constructor() {
    super();
    this.state = {
      title: 'Hideout Detail',
    };
  }

  render() {
    return (
      <MenuLayout title={this.state.title}>
        <div className="list">
          <div className="item">
            <h4 className="item-title">Hideout Type</h4>
            <h4 className="item-value">Enlightened Hideout</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Total Favor</h4>
            <h4 className="item-value">2,604,520</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Author</h4>
            <h4 className="item-value">Robby</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Version</h4>
            <h4 className="item-value">1.0.0</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Update</h4>
            <h4 className="item-value">2019.01.01</h4>
          </div>
          <div className="item">
            <h4 className="item-title">Create</h4>
            <h4 className="item-value">2018.12.31</h4>
          </div>
        </div>
      </MenuLayout>
    );
  }
}

export default DetailMenu;
