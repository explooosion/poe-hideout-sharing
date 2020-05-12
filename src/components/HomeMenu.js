import React, { useState } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Fieldset } from 'primereact/fieldset';

import MenuLayout from '../layout/MenuLayout';

import HideoutAPI from '../service/HideoutAPI';

const hideoutAPI = new HideoutAPI();

const Main = styled.div`
  *:not(.pi) {
    font-family: ${p => p.theme.globalFont};
  }

  .item-title {
    color: ${p => p.theme.warning};
  }

  .p-fieldset {
    border: 1px solid ${p => p.theme.lightWarning};
    background-color: ${p => rgba(p.theme.dark, .85)};
    margin-bottom: 1rem;
  }
`;

function HomeMenu(props) {
  const { t, i18n } = useTranslation();

  const [panelCollapsed, setPanelCollapsed] = useState(true);

  const [type, setType] = useState('');
  const [download, setDownload] = useState('');
  const [views, setViews] = useState('');
  const [favorite, setFavorite] = useState('');

  const [mtx, setMtx] = useState(null);
  const [miniRating, setMiniRating] = useState(null);
  const [alvaLevel, setAlvaLevel] = useState(null);
  const [einharLevel, setEinharLevel] = useState(null);
  const [nikoLevel, setNikoLevel] = useState(null);
  const [zanaLevel, setZanaLevel] = useState(null);

  const mtxs = [
    { label: t('HomeAll'), value: null },
    { label: t('HomeYes'), value: true },
    { label: t('HomeNo'), value: false },
  ];

  const miniRatings = [
    { label: t('HomeAll'), value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ];

  const alvaLevels = [
    { label: t('HomeAll'), value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
  ];

  const einharLevels = [
    { label: t('HomeAll'), value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
  ];

  const nikoLevels = [
    { label: t('HomeAll'), value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
  ];

  const zanaLevels = [
    { label: t('HomeAll'), value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
  ];

  const onSortChange = (event, setState) => {
    if (!_.isNull(event.target.value)) setState(event.target.value);
    props.onSortChange(event);
  }

  const onFilterChange = (event, setState) => {
    setState(event.target.value);
    props.onFilterChange(event);
  }

  const getHideoutsType = () => {
    return hideoutAPI.get(i18n.language).map(({ Icon, Name }) => ({
      img: Icon,
      label: Name.replace('Hideout', '').trim(),
      value: Name,
    }))
  }

  const renderHideoutTemplate = ({ label, img }) => {
    return (
      <div className="p-clearfix item-group">
        <img alt={label} src={img} />
        <span>{label}</span>
      </div>
    );
  }

  const renderSelectButton = () => {
    return [
      { label: t('HomeIncrement'), value: 'Increment' },
      { label: t('HomeDecrement'), value: 'Decrement' },
    ];
  }

  return (
    <MenuLayout title={t('HomeHideout')}>
      <Main>
        <div className="item">
          <h4 className="item-title">{t('HomeHideoutType')}</h4>
          <Dropdown
            name="type"
            id="hideout-type"
            style={{ width: '100%' }}
            value={type}
            options={getHideoutsType()}
            onChange={(e) => onFilterChange(e, setType)}
            filter={true}
            filterPlaceholder={`${t('HomeFilter')}...`}
            placeholder={t('HomeSelectType')}
            itemTemplate={renderHideoutTemplate}
            showClear={true}
          />
        </div>
        <Fieldset
          /** TODO */
          style={{ display: 'none' }}
          legend={`${t('HomeOptions')}(WIP)`}
          toggleable={true}
          collapsed={panelCollapsed}
          onToggle={(e) => setPanelCollapsed(e.value)}
        >
          <div className="item">
            <h4 className="item-title">MTX</h4>
            <Dropdown
              style={{ width: '100%' }}
              value={mtx}
              options={mtxs}
              onChange={(e) => setMtx(e.value)}
              placeholder="Select MTX"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Minimum Rating</h4>
            <Dropdown
              style={{ width: '100%' }}
              value={miniRating}
              options={miniRatings}
              onChange={(e) => setMiniRating(e.value)}
              placeholder="Select Minimum Rating"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Alva Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              value={alvaLevel}
              options={alvaLevels}
              onChange={(e) => setAlvaLevel(e.value)}
              placeholder="Select Alva Level"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Einhar Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              value={einharLevel}
              options={einharLevels}
              onChange={(e) => setEinharLevel(e.value)}
              placeholder="Select Einhar Level"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Niko Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              value={nikoLevel}
              options={nikoLevels}
              onChange={(e) => setNikoLevel(e.value)}
              placeholder="Select Niko Level"
            />
          </div>
          <div className="item">
            <h4 className="item-title">Zana Level</h4>
            <Dropdown
              style={{ width: '100%' }}
              value={zanaLevel}
              options={zanaLevels}
              onChange={(e) => setZanaLevel(e.value)}
              placeholder="Select Zana Level"
            />
          </div>
        </Fieldset>
        <div className="item">
          <h4 className="item-title">{t('HomeDownload')}</h4>
          <SelectButton
            name="download"
            id="hideout-download"
            value={download}
            options={renderSelectButton()}
            onChange={(e) => onSortChange(e, setDownload)}
          >
          </SelectButton>
        </div>
        <div className="item">
          <h4 className="item-title">{t('HomeViews')}</h4>
          <SelectButton
            name="views"
            id="hideout-views"
            value={views}
            options={renderSelectButton()}
            onChange={(e) => onSortChange(e, setViews)}
          >
          </SelectButton>
        </div>
        <div className="item">
          <h4 className="item-title">{t('HomeFavorite')}</h4>
          <SelectButton
            name="favorite"
            id="hideout-favorite"
            value={favorite}
            options={renderSelectButton()}
            onChange={(e) => onSortChange(e, setFavorite)}
          >
          </SelectButton>
        </div>
      </Main>
    </MenuLayout>
  );
}

export default HomeMenu;
