import React, { Component } from 'react';
import './Home.scss';

import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload } from 'react-icons/fa';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
// import PropTypes from 'prop-types';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Paginator } from 'primereact/paginator';
import { DeferredContent } from 'primereact/deferredcontent';

import ContentLayout from '../layout/ContentLayout';
import HomeMenu from '../components/HomeMenu';

class Home extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    const { Lists } = props.hideouts;
    this.state = {
      first: 0,
      rows: 20,
      breadcrumb: [
        { label: 'hideouts', url: '/' },
      ],
      hideouts: Lists,
    }
    this.props.history.listen(() => this.onlazyLoadImage());
  }

  componentDidMount() {
    setTimeout(() => this.onlazyLoadImage());
  }

  componentDidUpdate() {
    setTimeout(() => this.onlazyLoadImage());
  }

  onlazyLoadImage() {
    document.querySelectorAll('.lazy-image')
      .forEach(node => node.childNodes[2].classList.add('loaded'));
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
    this.setState({
      first: event.first,
      rows: event.rows,
    });
  }

  renderCards(lists = []) {
    // Lists by pages
    const listsByPage = [];
    lists.forEach((value, index) =>
      (
        index >= this.state.first &&
        index < (this.state.first + this.state.rows)
      ) ? listsByPage.push(value) : null);

    return listsByPage.map((hideout, index) => {
      const { uname } = this.props.users.get().find(({ uid }) => uid === hideout.authorId);
      return (
        <div className="p-xl-3 p-lg-4 p-md-6 p-sm-12" key={`card-${index}-${hideout.id}`}>
          <DeferredContent>
            <Card
              className="card-item"
              title={hideout.title}
              subTitle={uname}
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
          </DeferredContent>
        </div>
      );
    });
  }

  renderCardHeader(hideout = {}) {
    const { id, thumbnail, title } = hideout;
    return (
      <Link to={`/detail/${id}`}>
        <img className="card-image" alt={title} title={title} src={thumbnail} />
      </Link>
    );
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
    const { Lists } = this.props.hideouts;

    // Fake Data
    // let { Lists } = this.props.hideouts;
    // const ALists = [];
    // const FAKETOTAL = 100;
    // if (Lists.length > 0) {
    //   for (let i = 0; i < FAKETOTAL; i++) ALists[i] = Lists[0];
    //   Lists = ALists;
    // }

    return (
      <div className="home">
        <HomeMenu
          onSortChange={(key, value) => this.onSortChange(key, value)}
          onFilterChange={(key, value) => this.onFilterChange(key, value)}
        />
        <ContentLayout breadcrumb={this.state.breadcrumb}>
          {
            Lists.length === 0
              ? <ProgressBar mode="indeterminate" style={{ height: '10px' }} />
              :
              (
                <div className="card-group">
                  <div className="p-grid">{this.renderCards(Lists)}</div>
                  <br />
                  <Paginator first={this.state.first} rows={this.state.rows} rowsPerPageOptions={[20, 40, 60]} totalRecords={Lists.length} onPageChange={e => this.onPageChange(e)}></Paginator>
                </div>
              )
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
    users: state.users,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Home));
