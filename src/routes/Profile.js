import React, { Component } from 'react';
import './Profile.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaHeart, FaEye, FaDownload, FaEdit, FaTrashAlt } from 'react-icons/fa';
import moment from 'moment';

import { Growl } from 'primereact/growl';

import Session from '../service/Session';

import MasterLayout from '../layout/MasterLayout';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.id = props.match.params.id;
    this.auth = props.auth;
    this.database = props.database;
    this.storage = props.storage;
    this.users = props.users;
    this.isOwner = false;
  }

  componentWillMount() {
    // Both null
    if (!Session.get('auth') && !this.id) this.props.history.push('/');
    if (!this.id) {
      // View by auth
      if (!Session.get('auth')) this.props.history.push('/');
      if (!Object.keys(Session.get('auth')).includes('uid')) this.props.history.push('/');
      this.isOwner = Session.get('auth') ? true : false;
    } else {
      // View by id
      this.isOwner = Session.get('auth').uid === this.id ? true : false;
    }
  }

  /**
   * Delete this hideout and file
   * @param {object} hideout
   */
  async onDeleteHideout(hideout = {}) {
    if (!hideout.id && !hideout.fileName) return;
    await this.database.onDeleteHideouts(hideout.id);
    await this.storage.onDeleteHideout(hideout.fileName);
    this.growl.show({ severity: 'success', summary: 'Delete Hideout', detail: 'Delete successfully.' });
  }

  /**
   * Render hideouts
   * @param {array} hideouts
   */
  renderHideouts(hideouts = []) {
    return hideouts.map(h => {
      return (
        <tr key={`profile-list-${h.id}`}>
          <td><Link to={`/detail/${h.id}`}><FaExternalLinkAlt size="1.5rem" /></Link></td>
          <td><Link to={`/detail/${h.id}`}><img src={h.thumbnail} style={{ width: '100px', borderRadius: '.25rem' }} alt="thumbnail" title="thumbnail" /></Link></td>
          <td>{h.type}</td>
          <td>{h.title}</td>
          <td>{h.views}</td>
          <td>{h.download}</td>
          <td>{h.favorite}</td>
          <td>{moment(h.update).format('YYYY-MM-DD')}</td>
          <td className="profile-list-control">
            {
              this.isOwner ?
                (
                  <div>
                    <Link to={`/edit/${h.id}`}><FaEdit size="1.5rem" /></Link>
                    <FaTrashAlt
                      size="1.5rem"
                      onClick={() => window.confirm(`Delete 「${h.title}」 ???`) ? this.onDeleteHideout(h) : null}
                    />
                  </div>
                ) : null
            }
          </td>
        </tr>
      );
    })
  }

  render() {
    // If has id, then read id or get owner uid
    const ID = this.id ? this.id : Session.get('auth').uid;
    // Find list by user id
    const Hideouts = this.props.hideouts.Lists
      .filter(({ authorId }) => authorId === ID);
    // Find profile by user id
    // eslint-disable-next-line no-shadow
    const { avatar, uname } = this.users.get().find(({ uid }) => uid === ID);
    return (
      <MasterLayout>
        <div className="profile">
          <div className="profile-form">
            <img src={avatar} style={{ width: '70px', borderRadius: '100%' }} alt={uname} title={uname} />
            <h4 className="profile-name">{uname}</h4>
            {
              Hideouts.length > 0 ?
                (
                  <div className="profile-list-container">
                    <table className="profile-list">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}></th>
                          <th style={{ width: '100px' }}>Thumbnail</th>
                          <th>Type</th>
                          <th>Title</th>
                          <th><FaEye /></th>
                          <th><FaDownload /></th>
                          <th><FaHeart /></th>
                          <th>Update</th>
                          <th style={{ width: '80px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderHideouts(Hideouts)}
                      </tbody>
                    </table>
                  </div>
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
    auth: state.auth,
    database: state.database,
    storage: state.storage,
    users: state.users,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Profile));
