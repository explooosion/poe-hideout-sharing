import React, { Component } from 'react';
import './HomeMenu.scss';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Chart } from 'primereact/chart';

import MenuLayout from '../layout/MenuLayout';

import logo from '../images/logo.svg';

class HomeMenu extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    const { Type } = props.hideouts;
    this.state = {
      download: '',
      views: '',
      favorite: '',
      title: 'Hideout List',
      types: Type,
      type: '',
    };
  }

  onSortChange(state) {
    this.setState(state);
    const key = Object.keys(state)[0];
    this.props.onSortChange(key, state[key]);
  }

  onFilterChange(state) {
    this.setState(state);
    const key = Object.keys(state)[0];
    this.props.onFilterChange(key, state[key]);
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
        <img alt={option.label} src={option.img} />
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

  renderSelectButton() {
    return [
      { label: 'Increment', value: 'Increment' },
      { label: 'Decrement', value: 'Decrement' },
    ];
  }

  render() {
    return (
      <MenuLayout title={this.state.title}>
        <div className="item">
          <h4 className="item-title">Hideout Type</h4>
          <Dropdown
            style={{ width: '100%' }}
            value={this.state.type}
            options={this.state.types}
            onChange={(e) => this.onFilterChange({ type: e.value })}
            filter={true}
            filterPlaceholder="Filter..."
            placeholder="Select type"
            itemTemplate={this.renderHideoutTemplate}
            showClear={true}
          // selectedItemTemplate={this.renderHideoutSelectedTemplate}
          />
        </div>
        <div className="item">
          <h4 className="item-title">Download</h4>
          <SelectButton
            value={this.state.download}
            options={this.renderSelectButton()}
            onChange={(e) => this.onSortChange({ download: e.value })}
          >
          </SelectButton>
        </div>
        <div className="item">
          <h4 className="item-title">Views</h4>
          <SelectButton
            value={this.state.views}
            options={this.renderSelectButton()}
            onChange={(e) => this.onSortChange({ views: e.value })}
          >
          </SelectButton>
        </div>
        <div className="item">
          <h4 className="item-title">Favorite</h4>
          <SelectButton
            value={this.state.favorite}
            options={this.renderSelectButton()}
            onChange={(e) => this.onSortChange({ favorite: e.value })}
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

HomeMenu.propTypes = {}

const mapStateToProps = state => {
  return {
    hideouts: state.hideouts,
  }
}

export default connect(mapStateToProps)(HomeMenu);
