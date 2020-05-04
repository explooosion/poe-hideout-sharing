import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload, FaEdit } from 'react-icons/fa';
import NumberFormat from 'react-number-format';
import ReactHtmlParser from 'react-html-parser';
import jsFileDownload from 'js-file-download';
import moment from 'moment';
import _ from 'lodash';

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Growl } from 'primereact/growl';
import { SplitButton } from 'primereact/splitbutton';
import { TabMenu as PTabMenu } from 'primereact/tabmenu';

import ContentLayout from '../layout/ContentLayout';

import DetailMenu from '../components/DetailMenu';

import HideoutList from '../interface/HideoutList';

import { formatHideoutObject, formatHideoutFromFileContent } from '../utils/Format';

import {
  updateHideoutViews,
  updateHideoutFavorite,
  updateHideoutDownload,
} from '../actions';

import bg from '../images/bg.jpg';

import HideoutAPI from '../service/HideoutAPI';

const hideoutAPI = new HideoutAPI();

const Main = styled.article`
  display: flex;
  margin-top: ${p => p.theme.headerHeight};
  background-image: url(${bg});
  background-size: cover;
`;

const Author = styled(Toolbar)`

  &&& {
    margin: .25rem 0;
    padding: 0;
    border: none;
    color: #fff;
    background-color: transparent;
  }

  a:first-child {
    &::before {
      content: '@';
    }
    color: ${p => p.theme.warning};

    &:hover {
      text-decoration: underline;
    }
  }

  .p-toolbar-group-right {
    display: flex;
    align-items: center;

    span {
      display: block;
      margin: 0 .75rem 0 .25rem;
    }
  }
`;

const EditButton = styled(FaEdit)`
  margin-left: .25rem;
  color: ${p => p.theme.lightWarning};
  cursor: pointer;
`;

const Title = styled(Toolbar)`

  &&& {
    padding-left: .25rem;
    color: ${p => p.theme.warning};
    background-color: ${p => rgba(p.theme.dark, .85)};
    border: 2px solid ${p => p.theme.black};
    font-family:${p => p.theme.headerFont};
    z-index: 100;
  }

  h2 {
    margin-top: .15rem;
  }

  @media only screen and (min-width: ${p => p.theme.screenXl}) {
    position: sticky;
    top: -26px;
  }
`;

const Description = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  width: 100%;
  color: ${p => p.theme.lightWarning};
  background-color: ${p => rgba(p.theme.dark, .85)};
  border: 2px solid ${p => p.theme.black};
  border-radius: 3px;

  &:first-letter {
    text-transform: uppercase;
  }
`;

const TabMenu = styled(PTabMenu)`

  &&& {
    overflow: hidden;
    padding: 0;
    margin-top: 1.5rem;
  }

  .p-tabmenu-nav {
    border: 0;

    .p-tabmenuitem .p-menuitem-link:focus,
    .p-tabmenuitem .p-menuitem-link:active {
      box-shadow: none;
    }
  }
`;

const Content = styled.div`
  margin: 1.5rem 0;
  padding: .5rem 2rem;
  color: #fff;
  background-color: ${p => rgba(p.theme.dark, .85)};
  border: 2px solid ${p => p.theme.black};
  border-top: none;
  border-radius: 0 0 3px 3px;
`;

const ContentForm = styled(Content)`
  img {
    width: auto;
    max-width: 100%;
    border: 2px solid ${p => p.theme.gray};
  }
`;

const ContentCode = styled(Content)`
  p {
      color: ${p => p.theme.lightWarning};
  }

  b::after {
    content: '=';
    padding: 0 1rem;
  }

  code {
    color: ${p => p.theme.lightGray};
  }
`;

const ContentItems = styled(Content)`
  table {
    margin: 0 auto;
    width: 90%;
    border-collapse: collapse;
    color: #fff;
    text-align: center;
    font-size: 1.2rem;
  }

  th {
    color: ${p => p.theme.lightWarning};
  }

  th,
  td {
    padding: .5rem 0;
    border-bottom: 1px solid ${p => p.theme.gray};
  }

  td:nth-child(1) {
    color: ${p => p.theme.warning};
  }

  thead,
  tbody {
    border-bottom: 1px solid #fff;
  }
`;

const Footer = styled.div`
  padding: 1rem;
  background-color: ${p => rgba(p.theme.dark, .85)};
  border: 2px solid ${p => p.theme.black};
  border-top: 0;
  text-align: center;
`;

function Detail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { hideouts, users } = useSelector(state => state.firebase);
  const { isLogin, user } = useSelector(state => state.auth);

  let growl;
  let FileContent = { Objects: [] };

  const shareButtonItems = [
    {
      label: 'FaceBook',
      icon: 'pi pi-star-o',
      command: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${document.URL}`, '_blank'),
    },
    {
      label: 'Google',
      icon: 'pi pi-star-o',
      command: () => window.open(`https://plus.google.com/share?url=${document.URL}`, '_blank'),
    },
    {
      label: 'Twitter',
      icon: 'pi pi-star-o',
      command: () => window.open(`https://twitter.com/intent/tweet?text=${document.URL}`, '_blank'),
    },
  ];

  const tabMenu = [
    { label: t('DetailPreview'), icon: 'pi pi-images' },
    { label: t('DetailItems'), icon: 'pi pi-list' },
    { label: t('DetailCode'), icon: 'pi pi-file' },
  ];

  const [activeItem, setActiveItem] = useState(0);

  let hideout = new HideoutList();
  hideout = hideouts.find(h => h.id === id);

  useEffect(() => {
    if (!_.isUndefined(hideout)) {
      updateHideoutViews(hideout);
    }
  }, [hideout]);

  if (_.isUndefined(hideout)) return null;

  const { title, views, download, favorite, authorId, update, description, fileContent } = hideout;
  const { uname } = users.find(u => u.uid === authorId) || { uname: 'Unknown' };

  try { FileContent = JSON.parse(fileContent); }
  catch (e) { console.error('renderItems', e); }

  // Caculate total cost
  const COST = FileContent.Objects
    .map(c => Number(hideoutAPI.getDoodadByHash(c.Hash).Cost) || 0)
    .reduce((p, c) => p + c);

  const onTabChange = value => setActiveItem(value);

  /**
   * Update favorite counter
   */
  const onFavoriteClick = () => {
    console.log('onFavoriteClick');
    dispatch(updateHideoutFavorite(hideout));
    growl.show({ severity: 'success', summary: 'Favorite Hideout', detail: 'Add successfully.' });
  }

  /**
   * Download file and update counter
   */
  const onDownloadFileClick = (_fileContent = '') => {
    console.log('onDownloadFileClick');
    growl.show({ severity: 'info', summary: 'Download Hideout', detail: 'Start to download...' });
    jsFileDownload(formatHideoutFromFileContent(fileContent), `${title}.hideout`);
    dispatch(updateHideoutDownload(hideout));
  }

  /**
   * Switch active tab content
   * @param {object} h
   */
  const renderDetail = h => {
    switch (activeItem.label) {
      default:
      case t('DetailPreview'): return renderForm(h.formContent);
      case t('DetailItems'): return renderItems(h.fileContent);
      case t('DetailCode'): return renderCode(h.fileContent);
    }
  }

  /**
   * Render items tab
   */
  const renderItems = () => {
    const c = FileContent;
    return (
      <ContentItems>
        <table>
          <thead>
            <tr>
              <th>{t('DetailQuantity')}</th>
              <th>{t('DetailIcon')}</th>
              <th>{t('DetailName')}</th>
              <th>{t('DetailCost')}</th>
              <th>{t('DetailMasterLevel')}</th>
              <th>{t('DetailMasterName')}</th>
            </tr>
          </thead>
          <tbody>
            {
              // use uniqBy to remove duplicates from Objects
              _.uniqBy(c.Objects, 'Hash').map((objUniq, index) => {
                // caculate quantity
                const quantity = c.Objects.filter((obj) => obj.Hash === objUniq.Hash).length;
                // pick up attributes
                const { Hash, Icon, Cost, MasterLevel, MasterName } = hideoutAPI.getDoodadByHash(objUniq.Hash);
                // If not find then return null
                return Hash ? (
                  <tr key={`code-${index}-${Hash}`}>
                    <td>{quantity}</td>
                    <td><img src={Icon} alt={objUniq.Name} title={objUniq.Name} /></td>
                    <td>{objUniq.Name}</td>
                    <td><NumberFormat value={Cost} displayType={'text'} thousandSeparator={true} /></td>
                    <td>{MasterLevel}</td>
                    <td>{MasterName}</td>
                  </tr>
                ) : null; // console.warn('Can not find ', objUniq.Name);
              })
            }
          </tbody>
        </table>
      </ContentItems>
    );
  }

  /**
   * Render code tab
   */
  const renderCode = () => {
    const c = FileContent;
    return (
      <ContentCode>
        <p><b>Language</b><code>{c.Language}</code></p>
        <p><b>Hideout Hash</b><code>{_.get(c, 'Hideout Hash')}</code></p>
        <p><b>Hideout Name</b><code>{_.get(c, 'Hideout Name')}</code></p>
        <hr />
        {
          c.Objects.map((o, index) =>
            (
              <div key={`code-${index}-${o.Hash}`}>
                {index % 10 === 0 && index > 0 ? <hr /> : null}
                <p key={`hideout-object-${index}`}>
                  <b>{o.Name}</b><code>{formatHideoutObject(_.omit(o, 'Name'))}</code>
                </p>
              </div>
            )
          )
        }
      </ContentCode>
    )
  }

  const renderForm = (formContent = '') => {
    return (
      <ContentForm>
        {ReactHtmlParser(formContent)}
      </ContentForm>
    );
  }

  return (
    <Main>
      <DetailMenu hideout={hideout} cost={COST} />
      <ContentLayout>

        <Author>
          <summary className="p-toolbar-group-left">
            {t('DetailPostedby')} <Link to={`/profile/${authorId}`}>{uname}</Link> {moment().startOf('hour').from(update)}
            {
              /* Edit button */
              (isLogin ? (authorId === user.uid) : false)
                ? <Link to={`/edit/${id}`}><EditButton datatype="edit" /></Link>
                : null
            }
          </summary>
          <div className="p-toolbar-group-right">
            <FaEye />
            <span className="v">{views}</span>
            <FaDownload />
            <span className="d">{download}</span>
            <FaHeart />
            <span className="f">{favorite}</span>
          </div>
        </Author>

        <Title>
          <div className="p-toolbar-group-left">
            <h2 style={{ marginLeft: '.5rem' }}>{title}</h2>
          </div>
          <div className="p-toolbar-group-right">
            <Button label={t('DetailDownload')} icon="pi pi-download" style={{ marginRight: '.25em' }} onClick={() => onDownloadFileClick(fileContent)} />
            <Button icon="pi pi-star" className="p-button-success" style={{ marginRight: '.25em' }} onClick={() => onFavoriteClick()} />
            <Button icon="pi pi-exclamation-triangle" className="p-button-danger" style={{ marginRight: '.25em' }} />
            <SplitButton icon="pi pi-share-alt" className="p-button-warning" style={{ marginRight: '.25em' }} model={shareButtonItems}></SplitButton>
          </div>
        </Title>

        <Description>
          {description}
        </Description>

        <TabMenu
          model={tabMenu}
          activeItem={activeItem}
          onTabChange={(e) => onTabChange(e.value)}
        />

        <Growl ref={(el) => growl = el} />

        {renderDetail(hideout)}

        <Footer>
          <Button
            label={t('DetailBack')}
            icon="pi pi-arrow-left"
            iconPos="left"
            onClick={() => history.goBack()}
          />
        </Footer>
      </ContentLayout>
    </Main>
  );
}

export default Detail;
