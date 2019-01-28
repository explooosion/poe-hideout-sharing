import React, { Component } from 'react';
import './Profile.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaHeart, FaEye, FaDownload, FaEdit, FaTrashAlt } from 'react-icons/fa';
import store from 'store2';

import { Growl } from 'primereact/growl';

import MasterLayout from '../layout/MasterLayout';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.auth = props.firebase.auth;
    this.database = props.firebase.database;
    this.storage = props.firebase.storage;
    this.t = props.t;
  }

  componentWillMount() {
    if (!store.session('auth')) this.props.history.push('/');
  }

  /**
   * Delete this hideout and file
   * @param {object} list
   */
  async onDeleteHideout(list = {}) {
    if (!list.id && !list.fileName) return;
    await this.database.onDeleteHideouts(list.id);
    await this.storage.onDeleteHideout(list.fileName);
    this.growl.show({ severity: 'success', summary: 'Delete Hideout', detail: 'Delete successfully.' });
  }

  renderHideouts(Lists = []) {
    return Lists.map(list => {
      return (
        <tr key={list.id}>
          <td><Link to={`/detail/${list.id}`}><FaExternalLinkAlt size="1.5rem" /></Link></td>
          <td><Link to={`/detail/${list.id}`}><img src={list.thumbnail} style={{ width: '100px', borderRadius: '.25rem' }} alt="thumbnail" title="thumbnail" /></Link></td>
          <td>{list.type}</td>
          <td>{list.title}</td>
          <td>{list.views}</td>
          <td>{list.download}</td>
          <td>{list.favorite}</td>
          <td>{list.update}</td>
          <td className="profile-list-control">
            <Link to={`/edit/${list.id}`}><FaEdit size="1.5rem" /></Link>
            <FaTrashAlt
              size="1.5rem"
              onClick={() => window.confirm(`Delete 「${list.title}」 ???`) ? this.onDeleteHideout(list) : null}
            />
          </td>
        </tr>
      );
    })
  }

  render() {
    const { displayName, photoURL } = this.auth.user;
    const { Lists } = this.props.hideouts;
    return (
      <MasterLayout>
        <div className="profile">
          <div className="profile-form">
            <img src={photoURL} style={{ width: '80px', borderRadius: '100%' }} alt={`Hi~ ${displayName}`} title={`Hi~ ${displayName}`} />
            <h4 className="profile-name">{displayName}</h4>
            {
              Lists.length > 0 ?
                (
                  <table className="profile-list">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Thumbnail</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th><FaEye /></th>
                        <th><FaDownload /></th>
                        <th><FaHeart /></th>
                        <th>Update</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderHideouts(Lists)}
                    </tbody>
                  </table>
                ) : null
            }
          </div>
        </div>
        <Growl ref={(el) => this.growl = el} />
      </MasterLayout>
    );
  }
}

Profile.propTypes = {}

const mapStateToProps = state => {
  return {
    hideouts: state.hideouts,
    firebase: state.firebase,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Profile));
