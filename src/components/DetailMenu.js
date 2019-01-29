import React, { Component } from 'react';
import './DetailMenu.scss';

import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
// import 'moment/locale/zh-tw';

import MenuLayout from '../layout/MenuLayout';

moment.suppressDeprecationWarnings = true;

class DetailMenu extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.state = {
      hideout: props.hideout,
      title: 'Hideout Detail',
    };
  }

  render() {
    const { author, type, favour, version, update, create } = this.state.hideout;
    return (
      <MenuLayout title={this.state.title}>
        <div className="detail-menu">
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
              <h4 className="item-value">{moment(update).format('YYYY/MM/DD HH:mm:ss')}</h4>
            </div>
            <div className="item">
              <h4 className="item-title">Create</h4>
              <h4 className="item-value">{moment(create).format('YYYY/MM/DD HH:mm:ss')}</h4>
            </div>
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

export default withNamespaces()(connect(mapStateToProps)(DetailMenu));
