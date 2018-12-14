import React, { Component } from 'react';
import './Detail.scss';

import { Button } from 'primereact/button';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import Menu from '../components/Menu';

class Detail extends Component {

  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id: id,
    }
  }

  renderBreadCrumbItems() {
    return [
      { label: 'Categories', url: '/' },
      { label: `#${this.state.id}` },
      // { label: 'Hideout', url: '#' },
    ];
  }

  renderBreadCrumbHome() {
    return {
      icon: 'pi pi-home',
      url: '/',
    };
  }

  renderHideouts() {
    return (
      <div>
        <img src={require('../images/home_demo_2.jpg')} width="100%" />
        <hr />
        <img src={require('../images/home_demo_3.jpg')} width="100%" />
        <img src={require('../images/home_demo_4.jpg')} width="100%" />
        <img src={require('../images/home_demo_5.jpg')} width="100%" />
      </div>
    );
  }

  render() {
    return (
      <div className="detail">
        <Menu />
        <div className="content">
          <BreadCrumb
            className="bread"
            model={this.renderBreadCrumbItems()}
            home={this.renderBreadCrumbHome()}
          />
          <div className="block">
            <Toolbar style={{ backgroundColor: '#fff' }}>
              <div className="p-toolbar-group-left">
                <Button label="New" icon="pi pi-plus" style={{ marginRight: '.25em' }} />
                <Button label="Upload" icon="pi pi-upload" className="p-button-success" />
                <i className="pi pi-bars p-toolbar-separator" style={{ marginRight: '.25em' }} />
                <Button label="Save" icon="pi pi-check" className="p-button-warning" />
              </div>
              <div className="p-toolbar-group-right">
                <Button icon="pi pi-search" style={{ marginRight: '.25em' }} />
                <Button icon="pi pi-calendar" className="p-button-success" style={{ marginRight: '.25em' }} />
                <Button icon="pi pi-times" className="p-button-danger" />
              </div>
            </Toolbar>
            <br />
            {this.renderHideouts()}
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
