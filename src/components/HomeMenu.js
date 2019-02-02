import React, { Component } from 'react';
import './HomeMenu.scss';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
// import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Fieldset } from 'primereact/fieldset';
import _ from 'lodash';

import MenuLayout from '../layout/MenuLayout';

class HomeMenu extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.hideoutAPI = props.hideoutAPI;
    this.t = props.t;
    this.state = {
      download: '',
      views: '',
      favorite: '',
      types: this.hideoutAPI.get().map(({ Icon, Name }) => ({
        img: Icon,
        label: Name.replace('Hideout', '').trim(),
        value: Name.replace('Hideout', '').trim(),
      })),
      type: '',
      mtxs: [
        { label: this.t('HomeAll'), value: null },
        { label: this.t('HomeYes'), value: true },
        { label: this.t('HomeNo'), value: false },
      ],
      mtx: null,
      mini_ratings: [
        { label: this.t('HomeAll'), value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ],
      mini_rating: null,
      alva_levels: [
        { label: this.t('HomeAll'), value: null },
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
        { label: this.t('HomeAll'), value: null },
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
        { label: this.t('HomeAll'), value: null },
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
        { label: this.t('HomeAll'), value: null },
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

  componentWillReceiveProps() {
    this.setState({
      mtxs: [
        { label: this.t('HomeAll'), value: null },
        { label: this.t('HomeYes'), value: true },
        { label: this.t('HomeNo'), value: false },
      ],
      mini_ratings: [
        { label: this.t('HomeAll'), value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ],
      alva_levels: [
        { label: this.t('HomeAll'), value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
      einhar_levels: [
        { label: this.t('HomeAll'), value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
      niko_levels: [
        { label: this.t('HomeAll'), value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
      zana_levels: [
        { label: this.t('HomeAll'), value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
      ],
    });
  }

  onSortChange(state) {
    this.setState(state);
    const key = Object.keys(state)[0];
    this.props.onSortChange(key, state[key]);
  }

  onFilterChange(states = { type: '' }) {
    const state = _.pick(states, 'type');
    this.setState(state);
    const key = Object.keys(state)[0];
    this.props.onFilterChange(key, state[key]);
  }

  onSelectChange(state) {
    this.setState(state);
  }

  renderHideoutTemplate(option) {
    return (
      <div className="p-clearfix item-group">
        <img alt={option.label} src={option.img} />
        <span>{option.label}</span>
      </div>
    );
  }

  renderSelectButton() {
    return [
      { label: this.t('HomeIncrement'), value: 'Increment' },
      { label: this.t('HomeDecrement'), value: 'Decrement' },
    ];
  }

  render() {
    return (
      <MenuLayout title={this.t('HomeHideout')}>
        <div className="home-menu">
          <div className="item">
            <h4 className="item-title">{this.t('HomeHideoutType')}</h4>
            <Dropdown
              style={{ width: '100%' }}
              value={this.state.type}
              options={this.state.types}
              onChange={(e) => this.onFilterChange({ type: e.value })}
              filter={true}
              filterPlaceholder={`${this.t('HomeFilter')}...`}
              placeholder={this.t('HomeSelectType')}
              itemTemplate={this.renderHideoutTemplate}
              showClear={true}
            />
          </div>
          <Fieldset legend={this.t('HomeOptions')} toggleable={true} collapsed={this.state.panelOptions} onToggle={(e) => this.setState({ panelOptions: e.value })}>
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
            <h4 className="item-title">{this.t('HomeDownload')}</h4>
            <SelectButton
              value={this.state.download}
              options={this.renderSelectButton()}
              onChange={(e) => this.onSortChange({ download: e.value })}
            >
            </SelectButton>
          </div>
          <div className="item">
            <h4 className="item-title">{this.t('HomeViews')}</h4>
            <SelectButton
              value={this.state.views}
              options={this.renderSelectButton()}
              onChange={(e) => this.onSortChange({ views: e.value })}
            >
            </SelectButton>
          </div>
          <div className="item">
            <h4 className="item-title">{this.t('HomeFavorite')}</h4>
            <SelectButton
              value={this.state.favorite}
              options={this.renderSelectButton()}
              onChange={(e) => this.onSortChange({ favorite: e.value })}
            >
            </SelectButton>
          </div>
        </div>
      </MenuLayout>
    );
  }
}

HomeMenu.propTypes = {}

const mapStateToProps = state => {
  return {
    hideoutAPI: state.hideoutAPI,
  }
}

export default withNamespaces()(connect(mapStateToProps)(HomeMenu));
