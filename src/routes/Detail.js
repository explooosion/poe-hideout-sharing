import React, { Component } from 'react';
import './Detail.scss';

import { connect } from 'react-redux';
import { FaHeart, FaEye, FaDownload, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import moment from 'moment';
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
    this.storage = props.storage;
    this.database = props.database;
    this.auth = props.auth;
    this.id = props.match.params.id;
    this.hideout = new HideoutList();

    this.state = {
      tabmenu: [
        { label: 'Preview', icon: 'pi pi-images' },
        { label: 'Code', icon: 'pi pi-fw pi-file' },
        // { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
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
          this.growl.show({ severity: 'info', summary: 'Title', detail: 'Share FaceBook' });
        },
      },
      {
        label: 'Google',
        // icon: 'pi pi-star-o',
        command: (e) => {
          this.growl.show({ severity: 'warn', summary: 'Title', detail: 'Share Google' });
        },
      },
      {
        label: 'Twitter',
        // icon: 'pi pi-star-o',
        command: (e) => {
          this.growl.show({ severity: 'error', summary: 'Title', detail: 'Share Twitter' });
        },
      },
    ];
  }

  renderTitle({ title, type }) {
    return <h2>【{type}】{title}</h2>;
  }

  renderDetail({ screenshots }) {
    const { label } = this.state.activeItem;
    switch (label) {
      case 'Image': return this.renderImages(screenshots);
      case 'Code': return this.renderCode();
      case 'Edit': return this.renderEdit();
      default: return this.renderImages(screenshots);
    }
  }

  renderCode() {
    return (
      <div className="detail-content">
        <section className="section">
          <h3 className="section-title">renderCode</h3>
        </section>
      </div>
    )
  }

  renderEdit() {
    return (
      <div className="detail-content">
        <section className="section">
          <h3 className="section-title">renderEdit</h3>
        </section>
      </div>
    )
  }

  renderImages(screenshots = []) {
    return (
      <div className="detail-content">
        {
          screenshots.map((screenshot, index) => {
            return (
              <DeferredContent key={`content-${index}`}>
                <section className="section">
                  {this.renderImageContent(screenshot)}
                </section>
              </DeferredContent>
            );
          })
        }
      </div>
    );
  }

  /**
   * Render Hideout Content
   * @param {screenshot} object
   */
  renderImageContent(screenshot) {
    const { type, url, alt } = screenshot;
    switch (type) {
      case 'image':
        // Use debug local img
        // return <img alt={alt || url} title={alt || url} src={require(`../images/${url}`)} width="100%" />;
        return <img alt={alt || url} title={alt || url} src={url} width="100%" />;
      case 'youtube':
        return (
          <div className="youtube-container">
            <iframe title="share" src={url} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        );
      default: return null;
    }
  }

  render() {
    this.hideout = this.props.hideouts.Lists.find(({ id }) => id === this.id);
    if (!this.hideout) return <Redirect to="/" />;

    const { views, download, favorite, author, authorId, update, description, fileName } = this.hideout;
    const uid = Session.get('auth') ? Session.get('auth').uid : null;
    return (
      <article className="detail">
        <DetailMenu hideout={this.hideout} />
        <ContentLayout breadcrumb={this.state.breadcrumb}>
          <Toolbar className="detail-author">
            <summary className="p-toolbar-group-left">
              Posted by <Link to={`/profile/${authorId}`}>{author}</Link> {moment().startOf('hour').from(update)}
              {
                /* Edit button */
                authorId === uid
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
              {this.renderTitle(this.hideout)}
            </div>
            <div className="p-toolbar-group-right">
              <Button label="Download" icon="pi pi-download" style={{ marginRight: '.25em' }} onClick={e => this.onDownloadFileClick(fileName)} />
              <Button icon="pi pi-star" className="p-button-success" style={{ marginRight: '.25em' }} onClick={e => this.onFavoriteClick()} />
              <Button icon="pi pi-exclamation-triangle" className="p-button-danger" style={{ marginRight: '.25em' }} />
              <SplitButton icon="pi pi-share-alt" className="p-button-warning" style={{ marginRight: '.25em' }} onClick={this.save} model={this.getShareButtonItems()}></SplitButton>
            </div>
          </Toolbar>
          <div className="detail-description">
            <h4 className="detail-description-title">Description</h4>
            {description}
          </div>
          <TabMenu className="detaild-tabmenu" model={this.state.tabmenu} activeItem={this.state.activeItem} onTabChange={(e) => this.onTabChange(e.value)} />
          <Growl ref={(el) => this.growl = el} />
          {this.renderDetail(this.hideout)}
        </ContentLayout>
      </article>
    );
  }
}

Detail.propTypes = {}

const mapStateToProps = state => {
  return {
    hideouts: state.hideouts,
    auth: state.auth,
    database: state.database,
    storage: state.storage,
  }
}

export default connect(mapStateToProps)(Detail);
