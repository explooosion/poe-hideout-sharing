import React, { Component } from 'react';
import './HomeMenu.scss';

import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Chart } from 'primereact/chart';

import MenuLayout from '../layout/MenuLayout';

import logo from '../images/logo.svg';

class HomeMenu extends Component {

  constructor() {
    super();
    this.state = {
      hideout: ['Default'],
      mode: 'Normal',
      title: 'Hideout List',
    };
  }

  getHideouts() {
    return [
      { label: 'Default Hideout', value: 'Default' },
      { label: 'Arboreal Hideout', value: 'Arboreal' },
      { label: 'Backstreet Hideout', value: 'Backstreet' },
      { label: 'Baleful Hideout', value: 'Baleful' },
      { label: 'Battle-scarred Hideout', value: 'Battle-scarred' },
      { label: 'Brutal Hideout', value: 'Brutal' },
      { label: `Cartographer's Hideout`, value: `Cartographer's` },
      { label: 'Coastal Hideout', value: 'Coastal' },
      { label: 'Coral Hideout', value: 'Coral' },
      { label: 'Desert Hideout', value: 'Desert' },
    ];
  }

  getChartData() {
    return {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffcE56",
          ],
          hoverBackgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffce56",
          ],
        }],
    };
  }

  renderHideoutTemplate(option) {
    return (
      <div className="p-clearfix item-group">
        <img alt={option.label} src={logo} />
        <span>{option.label}</span>
      </div>
    );
  }

  renderHideoutSelectedTemplate(value) {
    if (value) {
      return (
        <div className="p-clearfix item-group">
          <img alt={value} src={logo} />
          <span>{value}</span>
        </div>
      );
    }
    else {
      return <span className="my-multiselected-empty-token">Choose</span>
    }
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
          <h4 className="item-title">Categories</h4>
          <Dropdown
            style={{ width: '100%' }}
            value={this.state.hideout}
            options={this.getHideouts()}
            onChange={e => { this.setState({ hideout: e.value }) }}
            filter={true}
            filterPlaceholder="Filter..."
            placeholder="Select hideout"
            itemTemplate={this.renderHideoutTemplate}
          // selectedItemTemplate={this.renderHideoutSelectedTemplate}
          />
        </div>
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
        <div className="item">
          <h4 className="item-title">Analysis</h4>
          <Chart type="doughnut" data={this.getChartData()} />
        </div>
      </MenuLayout>
    );
  }
}

export default HomeMenu;
