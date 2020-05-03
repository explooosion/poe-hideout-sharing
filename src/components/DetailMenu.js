import React from 'react';
import './DetailMenu.scss';

import { useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import _ from 'lodash';

import MenuLayout from '../layout/MenuLayout';

import HideoutAPI from '../service/HideoutAPI';

const hideoutAPI = new HideoutAPI();


// moment.suppressDeprecationWarnings = true;

function DetailMenu(props) {
  const { hideout, cost } = props;
  const { fileContent, version, update, create, authorId } = hideout;

  const { t, i18n } = useTranslation();

  const { users } = useSelector(state => state.firebase);
  const { uname } = users.find(u => u.uid === authorId) || { uname: 'Unknown' };

  let hash = null;
  try { hash = _.get(JSON.parse(fileContent), 'Hideout Hash'); }
  catch (e) { console.warn('renderHideouts', e); }

  return (
    <MenuLayout title={t('DetailHideout')}>
      <div className="detail-menu">
        <div className="list">
          <div className="item">
            <h4 className="item-title">{t('DetailHideoutType')}</h4>
            <h4 className="item-value">{hash ? _.get(hideoutAPI.getByHash(hash, i18n.language), 'Name') : ''}</h4>
          </div>
          <div className="item">
            <h4 className="item-title">{t('DetailTotalCost')}</h4>
            <h4 className="item-value">
              <NumberFormat value={cost} displayType={'text'} thousandSeparator={true} />
            </h4>
          </div>
          <div className="item">
            <h4 className="item-title">{t('DetailAuthor')}</h4>
            <h4 className="item-value">{uname}</h4>
          </div>
          <div className="item">
            <h4 className="item-title">{t('DetailVersion')}</h4>
            <h4 className="item-value">{version}</h4>
          </div>
          <div className="item">
            <h4 className="item-title">{t('DetailUpdate')}</h4>
            <h4 className="item-value">{moment(update).format('YYYY/MM/DD HH:mm:ss')}</h4>
          </div>
          <div className="item">
            <h4 className="item-title">{t('DetailCreate')}</h4>
            <h4 className="item-value">{moment(create).format('YYYY/MM/DD HH:mm:ss')}</h4>
          </div>
        </div>
      </div>
    </MenuLayout>
  );
}

export default DetailMenu;
