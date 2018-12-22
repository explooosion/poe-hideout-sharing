import React, { Component } from 'react';
import './Detail.scss';

import { connect } from 'react-redux';
import { FaHeart, FaEye, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
// import PropTypes from 'prop-types';

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { DeferredContent } from 'primereact/deferredcontent';
import { Growl } from "primereact/growl";
import { SplitButton } from 'primereact/splitbutton';
import { TabMenu } from 'primereact/tabmenu';

import ContentLayout from '../layout/ContentLayout';
import DetailMenu from '../components/DetailMenu';

class Detail extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    const { id } = this.props.match.params;
    const hideout = props.hideouts.Lists.find(list => list.id === id);

    this.state = {
      hideout: hideout,
      tabmenu: [
        { label: 'Images', icon: 'pi pi-images' },
        { label: 'Code', icon: 'pi pi-fw pi-file' },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
      ],
      activeItem: null,
      breadcrumb: [
        { label: 'hideouts', url: '/' },
        { label: `${id}` },
      ],
    }
  }

  onImageLoad() {
    console.log('load success');
    // this.growl.show({ severity: 'success', summary: 'Image Initialized', detail: 'Scroll down to load the datatable' });
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

  renderTitle() {
    const { title, type } = this.state.hideout;
    return <h2>【{type}】{title}</h2>;
  }

  renderHideouts() {
    return (
      <div className="detail-content">
        <DeferredContent onLoad={() => this.onImageLoad()}>
          <section className="section">
            <h3 className="section-title">GIF</h3>
            <img alt="" src={require('../images/home_demo_gif_1.gif')} width="100%" />
          </section>
        </DeferredContent>
        <DeferredContent onLoad={() => this.onImageLoad()}>
          <section className="section">
            <h3 className="section-title">GIF</h3>
            <img alt="" src={require('../images/home_demo_gif_2.gif')} width="100%" />
          </section>
        </DeferredContent>
        <DeferredContent>
          <section className="section">
            <h3 className="section-title">YOUTUBE</h3>
            <div className="youtube-container">
              <iframe title="share" src="https://www.youtube.com/embed/V3QVyJAN3yM?rel=0" frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </section>
        </DeferredContent>
        <DeferredContent>
          <section className="section">
            <h3 className="section-title">YOUTUBE</h3>
            <div className="youtube-container">
              <iframe title="share" src="https://www.youtube.com/embed/DDx1fysX5oo?rel=0" frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </section>
        </DeferredContent>
        <DeferredContent onLoad={() => this.onImageLoad()}>
          <section className="section">
            <h3 className="section-title">Title</h3>
            <img alt="" src={require('../images/home_demo_2.jpg')} width="100%" />
          </section>
        </DeferredContent>
        <DeferredContent onLoad={() => this.onImageLoad()}>
          <section className="section">
            <h3 className="section-title">JPG</h3>
            <img alt="" src={require('../images/home_demo_3.jpg')} width="100%" />
          </section>
        </DeferredContent>
        <DeferredContent onLoad={() => this.onImageLoad()}>
          <section className="section">
            <h3 className="section-title">JPG</h3>
            <img alt="" src={require('../images/home_demo_4.jpg')} width="100%" />
          </section>
        </DeferredContent>
        <DeferredContent onLoad={() => this.onImageLoad()}>
          <section className="section">
            <h3 className="section-title">JPG</h3>
            <img alt="" src={require('../images/home_demo_5.jpg')} width="100%" />
          </section>
        </DeferredContent>
      </div>
    );
  }

  render() {
    if (!this.state.hideout) return <Redirect to="/" />;

    const { views, download, favorite } = this.state.hideout;
    return (
      <article className="detail">
        <DetailMenu />
        <ContentLayout breadcrumb={this.state.breadcrumb}>
          <Toolbar className="detail-author">
            <summary className="p-toolbar-group-left">
              Posted by <Link to="/">Robby</Link> 20 hours ago
            </summary>
            <div className="p-toolbar-group-right">
              <FaEye />
              <span>{views}</span>
              <FaHeart />
              <span>{download}</span>
              <FaDownload />
              <span>{favorite}</span>
            </div>
          </Toolbar>
          <Toolbar className="detail-title">
            <div className="p-toolbar-group-left">
              {this.renderTitle()}
            </div>
            <div className="p-toolbar-group-right">
              <Button label="Download" icon="pi pi-download" style={{ marginRight: '.25em' }} />
              <Button icon="pi pi-star" className="p-button-success" style={{ marginRight: '.25em' }} />
              <Button icon="pi pi-exclamation-triangle" className="p-button-danger" style={{ marginRight: '.25em' }} />
              <SplitButton icon="pi pi-share-alt" className="p-button-warning" onClick={this.save} model={this.getShareButtonItems()}></SplitButton>
            </div>
          </Toolbar>
          <TabMenu className="detaild-tabmenu" model={this.state.tabmenu} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({ activeItem: e.value })} />
          <Growl ref={(el) => this.growl = el} />
          {this.renderHideouts()}
        </ContentLayout>
      </article>
    );
  }
}

Detail.propTypes = {}

const mapStateToProps = state => {
  return {
    hideouts: state.hideouts,
  }
}

export default connect(mapStateToProps)(Detail);
