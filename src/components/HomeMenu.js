import React, { Component } from 'react';
import './HomeMenu.scss';

import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Fieldset } from 'primereact/fieldset';

import MenuLayout from '../layout/MenuLayout';

import logo from '../images/logo.svg';

class HomeMenu extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    console.log(props.hideouts);
    this.state = {
      download: '',
      views: '',
      favorite: '',
      title: 'Hideout List',
      types: props.hideoutTypes,
      type: '',
      mtxs: [
        { label: 'All', value: null },
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      mtx: null,
      mini_ratings: [
        { label: 'All', value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ],
      mini_rating: null,
      alva_levels: [
        { label: 'All', value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
      alva_level: null,
      einhar_levels: [
        { label: 'All', value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
      einhar_level: null,
      niko_levels: [
        { label: 'All', value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
      niko_level: null,
      zana_levels: [
        { label: 'All', value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
      zana_level: null,
      panelOptions: true,
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

  onSelectChange(state) {
    this.setState(state);
    // const key = Object.keys(state)[0];
    // this.props.onFilterChange(key, state[key]);
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
        <div className="home-menu">
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
          <Fieldset legend="Options" toggleable={true} collapsed={this.state.panelOptions} onToggle={(e) => this.setState({ panelOptions: e.value })}>
            <div className="item">
              <h4 className="item-title">MTX</h4>
              <Dropdown
                style={{ width: '100%' }}
                value={this.state.mtx}
                options={this.state.mtxs}
                onChange={(e) => this.onSelectChange({ mtx: e.value })}
                placeholder="Select MTX"
              />
            </div>
            <div className="item">
              <h4 className="item-title">Minimum Rating</h4>
              <Dropdown
                style={{ width: '100%' }}
                value={this.state.mini_rating}
                options={this.state.mini_ratings}
                onChange={(e) => this.onSelectChange({ mini_rating: e.value })}
                placeholder="Select Minimum Rating"
              />
            </div>
            <div className="item">
              <h4 className="item-title">Alva Level</h4>
              <Dropdown
                style={{ width: '100%' }}
                value={this.state.alva_level}
                options={this.state.alva_levels}
                onChange={(e) => this.onSelectChange({ alva_level: e.value })}
                placeholder="Select Alva Level"
              />
            </div>
            <div className="item">
              <h4 className="item-title">Einhar Level</h4>
              <Dropdown
                style={{ width: '100%' }}
                value={this.state.einhar_level}
                options={this.state.einhar_levels}
                onChange={(e) => this.onSelectChange({ einhar_level: e.value })}
                placeholder="Select Einhar Level"
              />
            </div>
            <div className="item">
              <h4 className="item-title">Niko Level</h4>
              <Dropdown
                style={{ width: '100%' }}
                value={this.state.niko_level}
                options={this.state.niko_levels}
                onChange={(e) => this.onSelectChange({ niko_level: e.value })}
                placeholder="Select Niko Level"
              />
            </div>
            <div className="item">
              <h4 className="item-title">Zana Level</h4>
              <Dropdown
                style={{ width: '100%' }}
                value={this.state.zana_level}
                options={this.state.zana_levels}
                onChange={(e) => this.onSelectChange({ zana_level: e.value })}
                placeholder="Select Zana Level"
              />
            </div>
          </Fieldset>
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
          {
            /*
            <div className="item">
              <h4 className="item-title">Analysis</h4>
              <Chart type="doughnut" data={this.getChartData()} />
            </div>
            */
          }
        </div>
      </MenuLayout>
    );
  }
}

HomeMenu.propTypes = {}

const mapStateToProps = state => {
  return {
    hideoutTypes: state.hideoutTypes,
  }
}

export default connect(mapStateToProps)(HomeMenu);
