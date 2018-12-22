import React, { Component } from 'react';
import './Home.scss';

import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload, FaPencilAlt } from 'react-icons/fa';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
// import { ProgressBar } from 'primereact/progressbar';
import { Paginator } from 'primereact/paginator';

import ContentLayout from '../layout/ContentLayout';
import HomeMenu from '../components/HomeMenu';

class Home extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    const { Lists } = props.hideouts;
    this.state = {
      first: 0,
      rows: 10,
      breadcrumb: [
        { label: 'hideouts', url: '/' },
      ],
      hideouts: Lists || [],
    }
  }

  /**
   * Sort hideouts
   * @param {string} key
   * @param {string} value
   */
  onSortChange(key, value) {
    const hideouts = this.state.hideouts;
    this.setState({
      hideouts: value === 'Increment'
        ? hideouts.sort((a, b) => {
          return a[key] - b[key];
        })
        : hideouts.sort((a, b) => {
          return b[key] - a[key];
        }),
    });
  }

  /**
   * Filter hideouts
   * @param {string} key
   * @param {string} value
   */
  onFilterChange(key, value) {
    const { Lists } = this.props.hideouts;
    this.setState({
      hideouts: Lists.filter(hideout => {
        if (value) return hideout[key] === value;
        return hideout[key];
      }),
    });
  }

  onPageChange(event) {
    console.log(event);
    this.setState({
      first: event.first,
      rows: event.rows,
    });
  }

  renderCards() {
    return this.state.hideouts.map((hideout, index) => {
      return (
        <div className="p-xl-3 p-lg-4 p-md-6 p-sm-12" key={`card-${index}-${hideout.id}`}>
          <Link to={`/detail/${hideout.id}`}>
            <Card
              style={{ cursor: 'pointer' }}
              title={hideout.title}
              subTitle={hideout.author}
              header={this.renderCardHeader(hideout)}
            >
              <div className="card-counts">
                <div>
                  <FaEye />
                  <span>{hideout.views}</span>
                </div>
                <div>
                  <FaDownload />
                  <span>{hideout.download}</span>
                </div>
                <div>
                  <FaHeart />
                  <span>{hideout.favorite}</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      );
    });
  }

  renderCardHeader(hideout) {
    const { img } = hideout;
    // return <div className="card-img" style={{ backgroundImage: `url(${img})` }}></div>;
    return <img alt={img} title={img} src={img} />;
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
    const { t } = this.props;
    return (
      <div className="home">
        <HomeMenu
          onSortChange={(key, value) => this.onSortChange(key, value)}
          onFilterChange={(key, value) => this.onFilterChange(key, value)}
        />
        <ContentLayout breadcrumb={this.state.breadcrumb}>
          <div className="p-grid">
            {this.renderCards()}
          </div>
          <br />
          <Paginator first={this.state.first} rows={this.state.rows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={e => this.onPageChange(e)}></Paginator>
          {
            /*
            <div className="p-grid search">
              <ProgressBar className="p-col" mode="indeterminate" style={{ height: '8px' }}></ProgressBar>
            </div>
            */
          }
        </ContentLayout>
      </div>
    );
  }
}

Home.propTypes = {}

const mapStateToProps = state => {
  return {
    hideouts: state.hideouts,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Home));
