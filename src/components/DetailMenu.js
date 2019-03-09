import React, { Component } from 'react';
import './DetailMenu.scss';

import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import _ from 'lodash';
// import 'moment/locale/zh-tw';

import MenuLayout from '../layout/MenuLayout';

moment.suppressDeprecationWarnings = true;

class DetailMenu extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.users = props.users;
    this.hideoutAPI = props.hideoutAPI;
    this.t = props.t;
    this.state = {
      hideout: props.hideout,
    };
  }

  render() {
    const { fileContent, version, update, create, authorId } = this.props.hideout;
    const { uname } = this.users.getById(authorId);

    let hash = null;
    try {
      hash = _.get(JSON.parse(fileContent), 'Hideout Hash');
    } catch (e) { console.warn('renderHideouts', e); }

    return (
      <MenuLayout title={this.t('DetailHideout')}>
        <div className="detail-menu">
          <div className="list">
            <div className="item">
              <h4 className="item-title">{this.t('DetailHideoutType')}</h4>
              <h4 className="item-value">{hash ? _.get(this.hideoutAPI.getByHash(hash, this.props.lng), 'Name') : ''}</h4>
            </div>
            <div className="item">
              <h4 className="item-title">{this.t('DetailTotalCost')}</h4>
              <h4 className="item-value">
                <NumberFormat value={this.props.cost} displayType={'text'} thousandSeparator={true} />
              </h4>
            </div>
            <div className="item">
              <h4 className="item-title">{this.t('DetailAuthor')}</h4>
              <h4 className="item-value">{uname}</h4>
            </div>
            <div className="item">
              <h4 className="item-title">{this.t('DetailVersion')}</h4>
              <h4 className="item-value">{version}</h4>
            </div>
            <div className="item">
              <h4 className="item-title">{this.t('DetailUpdate')}</h4>
              <h4 className="item-value">{moment(update).format('YYYY/MM/DD HH:mm:ss')}</h4>
            </div>
            <div className="item">
              <h4 className="item-title">{this.t('DetailCreate')}</h4>
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
    users: state.users,
    hideoutAPI: state.hideoutAPI,
  }
}

export default withTranslation()(connect(mapStateToProps)(DetailMenu));
