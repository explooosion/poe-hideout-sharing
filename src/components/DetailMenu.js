import React, { Component } from 'react';
import './DetailMenu.scss';

import { SelectButton } from 'primereact/selectbutton';

import MenuLayout from '../layout/MenuLayout';

class DetailMenu extends Component {

  constructor() {
    super();
    this.state = {
      mode: 'Normal',
      title: 'Hideout Detail',
    };
  }

  renderMode() {
    return [
      { label: 'Easy', value: 'Easy' },
      { label: 'Normal', value: 'Normal' },
      { label: 'Hard', value: 'Hard' },
    ];
  }

  render() {
    return (
      <MenuLayout title={this.state.title}>
        <div className="item">
          <h4 className="item-title">Level</h4>
          <SelectButton
            value={this.state.mode}
            options={this.renderMode()}
            onChange={(e) =>
              this.setState({ mode: e.value })}
          >
          </SelectButton>
        </div>
      </MenuLayout>
    );
  }
}

export default DetailMenu;
