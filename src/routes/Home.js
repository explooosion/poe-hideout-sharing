import React, { Component } from 'react';
import './Home.scss';

import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Paginator } from 'primereact/paginator';

import { FaHeart, FaEye, FaDownload } from 'react-icons/fa';

import ContentLayout from '../layout/ContentLayout';
import HomeMenu from '../components/HomeMenu';

class Home extends Component {

  constructor() {
    super();
    this.state = {
      first: 0,
      rows: 10,
      breadcrumb: [
        { label: 'Categories', url: '/' },
      ],
    }

    this.imgs = [
      require('../images/home_demo_gif_2.gif'),
      require('../images/home_demo_3.jpg'),
      require('../images/home_demo_gif_1.gif'),
      require('../images/home_demo_gif_2.gif'),
      require('../images/home_demo_gif_1.gif'),
      require('../images/home_demo_gif_2.gif'),
      require('../images/home_demo_4.jpg'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_gif_1.gif'),
      require('../images/home_demo_5.jpg'),
      require('../images/home_demo_gif_1.gif'),
      require('../images/home_demo_4.jpg'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_gif_2.gif'),
      require('../images/home_demo_2.jpg'),
      require('../images/home_demo_3.jpg'),
      require('../images/home_demo_5.jpg'),
      require('../images/home_demo_gif_1.gif'),
    ];
  }

  onPageChange(event) {
    console.log(event);
    this.setState({
      first: event.first,
      rows: event.rows,
    });
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
                <FaDownload />
                <span>{Math.floor(Math.random() * 500)}</span>
              </div>
              <div className="card-tag">
                <FaHeart />
                <span>{Math.floor(Math.random() * 300)}</span>
              </div>
              <div className="card-tag">
                <FaEye />
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

  render() {
    return (
      <div className="home">
        <HomeMenu />
        <ContentLayout breadcrumb={this.state.breadcrumb}>
          <div className="p-grid">
            {this.renderCards()}
          </div>
          <Paginator first={this.state.first} rows={this.state.rows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={e => this.onPageChange(e)}></Paginator>
          <div className="p-grid search">
            <ProgressBar className="p-col" mode="indeterminate" style={{ height: '8px' }}></ProgressBar>
          </div>
        </ContentLayout>
      </div>
    );
  }
}

export default Home;
