import React, { Component } from 'react';
import './Home.scss';

import { Link } from 'react-router-dom';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';

import Menu from '../components/Menu';

class Home extends Component {

  constructor() {
    super();
    this.imgs = [
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_3.jpg'),
      require('../images/home_demo_4.jpg'),
      require('../images/home_demo_5.jpg'),
      require('../images/home_demo_4.jpg'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_4.jpg'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_3.jpg'),
      require('../images/home_demo_5.jpg'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_4.jpg'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_5.jpg'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_3.jpg'),
      require('../images/home_demo_5.jpg'),
      require('../images/home_demo_4.jpg'),
    ];
  }

  renderCards() {
    return this.imgs.map((img, index) => {
      return (
        <div className="p-lg-3 p-md-6 p-sm-12" key={`card-${index}`}>
          <Link to={`/detail/${index}`}>
            <Card
              style={{ cursor: 'pointer' }}
              title="Default Hideout"
              subTitle="Robby"
              header={this.renderCardHeader(index)}
            >
              <div className="card-tag">
                <i className="pi pi-download"></i>
                <span>{Math.floor(Math.random() * 500)}</span>
              </div>
              <div className="card-tag">
                <i className="pi pi-star"></i>
                <span>{Math.floor(Math.random() * 300)}</span>
              </div>
              <div className="card-tag">
                <i className="pi pi-eye"></i>
                <span>{Math.floor(Math.random() * 3000)}</span>
              </div>
            </Card>
          </Link>
        </div>
      );
    });
  }

  renderCardHeader(num) {
    return <img alt={`demo${num}`} src={this.imgs[num]} />;
  }

  renderCardFooter() {
    return (
      <span>
        <Button label="Save" icon="pi pi-check" style={{ marginRight: '.25em' }} />
        <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" />
      </span>
    );
  }

  renderBreadCrumbItems() {
    return [
      { label: 'Categories' },
      // { label: 'Hideout', url: '#' },
    ];
  }

  renderBreadCrumbHome() {
    return {
      icon: 'pi pi-home',
      url: '/',
    };
  }

  render() {
    return (
      <div className="home">
        <Menu />
        <div className="content">
          <BreadCrumb
            className="bread"
            model={this.renderBreadCrumbItems()}
            home={this.renderBreadCrumbHome()}
          />
          <div className="block">
            <div className="p-grid">
              {this.renderCards()}
            </div>
            <div className="p-grid search">
              <ProgressBar className="p-col" mode="indeterminate" style={{ height: '8px' }}></ProgressBar>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
