import React, { Component } from 'react';
import './Detail.scss';

import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { FaHeart, FaEye, FaDownload, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';
// import PropTypes from 'prop-types';

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { DeferredContent } from 'primereact/deferredcontent';
import { Growl } from 'primereact/growl';
import { SplitButton } from 'primereact/splitbutton';
import { TabMenu } from 'primereact/tabmenu';

import ContentLayout from '../layout/ContentLayout';
import DetailMenu from '../components/DetailMenu';

import HideoutList from '../interface/HideoutList';

import Session from '../service/Session';

class Detail extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.storage = props.storage;
    this.database = props.database;
    this.users = props.users;
    this.auth = props.auth;
    this.hideoutAPI = props.hideoutAPI;
    this.id = props.match.params.id;
    this.hideout = new HideoutList();
    this.fileContent = { Objects: [] };
    this.state = {
      tabMenu: [
        { label: this.t('DetailPreview'), icon: 'pi pi-images' },
        { label: this.t('DetailItems'), icon: 'pi pi-list' },
        { label: this.t('DetailCode'), icon: 'pi pi-file' },
      ],
      activeItem: 0,
      breadcrumb: [
        { label: 'hideouts', url: '/' },
        { label: `${this.id}` },
      ],
    }
  }

  componentWillMount() {
    this.database.onUpdateHideoutViews(this.id);
  }

  componentWillReceiveProps() {
    this.setState({
      tabMenu: [
        { label: this.t('DetailPreview'), icon: 'pi pi-images' },
        { label: this.t('DetailItems'), icon: 'pi pi-list' },
        { label: this.t('DetailCode'), icon: 'pi pi-file' },
      ],
    });
  }

  onTabChange(value) {
    this.setState({ activeItem: value });
  }

  /**
   * Update favorite counter
   */
  async onFavoriteClick() {
    await this.database.onUpdateHideoutFavorite(this.id);
    this.growl.show({ severity: 'success', summary: 'Favorite Hideout', detail: 'Add successfully.' });
  }

  /**
   * Download file and update counter
   */
  async onDownloadFileClick(fileName) {
    this.growl.show({ severity: 'info', summary: 'Download Hideout', detail: 'Start to download...' });
    const URL = await this.storage.getHideoutLink(fileName);
    window.open(URL, '_blank');
    await this.database.onUpdateHideoutDownload(this.id);
  }

  getShareButtonItems() {
    return [
      {
        label: 'FaceBook',
        // icon: 'pi pi-star-o',
        command: (e) => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${document.URL}`, '_blank');
        },
      },
      {
        label: 'Google',
        // icon: 'pi pi-star-o',
        command: (e) => {
          window.open(`https://plus.google.com/share?url=${document.URL}`, '_blank');
        },
      },
      {
        label: 'Twitter',
        // icon: 'pi pi-star-o',
        command: (e) => {
          window.open(`https://twitter.com/intent/tweet?text=${document.URL}`, '_blank');
        },
      },
    ];
  }

  renderDetail({ formContent, fileContent }) {
    const { label } = this.state.activeItem;
    switch (label) {
      default:
      case this.t('DetailPreview'): return this.renderForm(formContent);
      case this.t('DetailItems'): return this.renderItems(fileContent);
      case this.t('DetailCode'): return this.renderCode(fileContent);
    }
  }

  renderItems() {
    const c = this.fileContent;
    return (
      <div className="detail-content">
        <section className="section">
          <table className="detail-items">
            <thead>
              <tr>
                <th>{this.t('DetailQuantity')}</th>
                <th>{this.t('DetailIcon')}</th>
                <th>{this.t('DetailName')}</th>
                <th>{this.t('DetailCost')}</th>
                <th>{this.t('DetailMasterLevel')}</th>
                <th>{this.t('DetailMasterName')}</th>
              </tr>
            </thead>
            <tbody>
              {
                // remove duplicates from Objects
                _.uniqBy(c.Objects, 'Hash').map((objUniq, index) => {
                  const quantity = c.Objects.filter((obj) => obj.Hash === objUniq.Hash).length;
                  const { Hash, Icon, Cost, MasterLevel, MasterName } = this.hideoutAPI.getDoodadByHash(objUniq.Hash);
                  // If unfind then null
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
        </section>
      </div>
    );
  }

  renderCode() {
    this.t = this.props.t;
    const c = this.fileContent;
    return (
      <div className="detail-content">
        <section className="section detail-code">
          <p><b>Language</b><code className="section-title">{c.Language}</code></p>
          <p><b>Hideout Hash</b><code className="section-title">{c['Hideout Hash']}</code></p>
          <p><b>Hideout Name</b><code className="section-title">{c['Hideout Name']}</code></p>
          <hr />
          {
            c.Objects.map((o, index) => {
              return (
                <div key={`code-${index}-${o.Hash}`}>
                  {index % 10 === 0 && index > 0 ? <hr /> : null}
                  <p key={`hideout-object-${index}`}><b>{o.Name}</b><code className="section-title">{JSON.stringify(o)}</code></p>
                </div>
              )
            })
          }
        </section>
      </div>
    )
  }

  renderForm(formContent = '') {
    return (
      <div className="detail-content">
        <DeferredContent>
          <section className="section detail-form">
            {ReactHtmlParser(formContent)}
          </section>
        </DeferredContent>
      </div>
    );
  }

  render() {
    this.hideout = this.database.get().find(({ id }) => id === this.id);
    if (!this.hideout) return <Redirect to="/" />;

    const { title, views, download, favorite, authorId, update, description, fileName, fileContent } = this.hideout;
    const { uname } = this.users.getById(authorId);

    try { this.fileContent = JSON.parse(fileContent); }
    catch (e) { console.error('renderItems', e); }

    // Caculate total cost
    const COST = this.fileContent.Objects
      .map(c => Number(this.hideoutAPI.getDoodadByHash(c.Hash).Cost) || 0)
      .reduce((p, c) => p + c);

    return (
      <article className="detail">
        <DetailMenu hideout={this.hideout} cost={COST} />
        <ContentLayout breadcrumb={this.state.breadcrumb}>
          <Toolbar className="detail-author">
            <summary className="p-toolbar-group-left">
              {this.t('DetailPostedby')} <Link to={`/profile/${authorId}`}>{uname}</Link> {moment().startOf('hour').from(update)}
              {
                /* Edit button */
                (Session.get('auth') ? (authorId === Session.get('auth').uid) : false)
                  ? <Link to={`/edit/${this.id}`}><FaEdit className="detail-button" datatype="edit" /></Link>
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
          </Toolbar>
          <Toolbar className="detail-title">
            <div className="p-toolbar-group-left">
              <h2 style={{ marginLeft: '.5rem' }}>{title}</h2>
            </div>
            <div className="p-toolbar-group-right">
              <Button label={this.t('DetailDownload')} icon="pi pi-download" style={{ marginRight: '.25em' }} onClick={e => this.onDownloadFileClick(fileName)} />
              <Button icon="pi pi-star" className="p-button-success" style={{ marginRight: '.25em' }} onClick={e => this.onFavoriteClick()} />
              <Button icon="pi pi-exclamation-triangle" className="p-button-danger" style={{ marginRight: '.25em' }} />
              <SplitButton icon="pi pi-share-alt" className="p-button-warning" style={{ marginRight: '.25em' }} onClick={this.save} model={this.getShareButtonItems()}></SplitButton>
            </div>
          </Toolbar>
          <div className="detail-description">
            {description}
          </div>
          <TabMenu className="detaild-tabmenu" model={this.state.tabMenu} activeItem={this.state.activeItem} onTabChange={(e) => this.onTabChange(e.value)} />
          <Growl ref={(el) => this.growl = el} />
          {this.renderDetail(this.hideout)}
          <div className="detail-footer">
            <Button label={this.t('DetailBack')} icon="pi pi-arrow-left" iconPos="left" onClick={() => this.props.history.push('/')} />
          </div>
        </ContentLayout>
      </article>
    );
  }
}

Detail.propTypes = {}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    database: state.database,
    hideoutAPI: state.hideoutAPI,
    storage: state.storage,
    users: state.users,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Detail));
