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
    this.users = props.users;
    this.auth = props.auth;
    this.id = props.match.params.id;
    this.hideout = new HideoutList();

    this.state = {
      tabmenu: [
        { label: 'Preview', icon: 'pi pi-images' },
        { label: 'Code', icon: 'pi pi-fw pi-file' },
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

  renderTitle({ title, type }) {
    return <h2>【{type}】{title}</h2>;
  }

  renderDetail({ screenshots, fileContent }) {
    const { label } = this.state.activeItem;
    switch (label) {
      case 'Image': return this.renderImages(screenshots);
      case 'Code': return this.renderCode(fileContent);
      default: return this.renderImages(screenshots);
    }
  }

  renderCode(code = '') {
    const c = JSON.parse(code);
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
                <div>
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
  renderImageContent({ type, url, alt } = {}) {
    switch (type) {
      case 'image':
        // Use debug local img
        // return <img alt={alt || url} title={alt || url} src={require(`../images/${url}`)} width="100%" />;
        return <img alt={alt || url} title={alt || url} src={url} style={{ maxWidth: '100%' }} />;
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
    const { views, download, favorite, authorId, update, description, fileName } = this.hideout;
    const { uname } = this.users.getById(authorId);
    return (
      <article className="detail">
        <DetailMenu hideout={this.hideout} />
        <ContentLayout breadcrumb={this.state.breadcrumb}>
          <Toolbar className="detail-author">
            <summary className="p-toolbar-group-left">
              Posted by <Link to={`/profile/${authorId}`}>{uname}</Link> {moment().startOf('hour').from(update)}
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
          <div className="detail-footer">
            <Button label="Back" icon="pi pi-arrow-left" iconPos="left" onClick={() => this.props.history.push('/')} />
          </div>
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
    users: state.users,
  }
}

export default connect(mapStateToProps)(Detail);
