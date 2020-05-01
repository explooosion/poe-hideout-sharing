/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import './Profile.scss';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload, FaEdit } from 'react-icons/fa';
import moment from 'moment';
import _ from 'lodash';

import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import MasterLayout from '../layout/MasterLayout';

import HideoutAPI from '../service/HideoutAPI';

const hideoutAPI = new HideoutAPI();

function Profile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();

  const { hideouts } = useSelector(state => state.firebase);
  const { isLogin, user } = useSelector(state => state.auth);

  const [name, setName] = useState('');
  const [nameEdit, setNameEdit] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [avatarEdit, setAvatarEdit] = useState(false);

  let targetId = id;
  if (isLogin && id === user.uid || _.isUndefined(id)) {
    targetId = user.uid;
  }

  const isOwner = targetId === user.uid;
  const userHideouts = hideouts.filter(h => h.authorId === targetId);

  console.log(hideouts);
  console.log(userHideouts);

  const onUpdateProfileName = _name => {
    console.log('onUpdateProfileName', _name);
  }

  const onUpdateProfileAvatar = _avatar => {
    console.log('onUpdateProfileAvatar', _avatar);
  }

  const onDeleteHideout = h => {
    console.log('onDeleteHideout', h);
  }

  const renderAvatar = () => {
    return isOwner ?
      (
        <div>
          <div className="profile-avatar-edit" style={!avatarEdit ? { display: 'none' } : {}}>
            <InputText
              style={{ width: '300px' }}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              onKeyPress={(e) => {
                if (e.charCode === 13 && avatar.length > 0) {
                  onUpdateProfileAvatar(avatar);
                  setAvatarEdit(false);
                }
              }}
            />
            <Button
              icon="pi pi-check"
              style={{ margin: '0 .15rem 0 .25rem' }}
              onClick={() => {
                if (avatar.length > 0) {
                  onUpdateProfileAvatar(avatar);
                  setAvatarEdit(false);
                }
              }}
            />
            <Button icon="pi pi-times" style={{ margin: '0 .15rem' }} onClick={() => setAvatarEdit(false)} />
          </div>
          <div className="profile-avatar">
            <img src={user.photoURL} style={{ height: '70px', borderRadius: '100%' }} alt={user.displayName} title={user.displayName} />
            <FaEdit
              size="1.3rem"
              onClick={() => {
                setAvatar(user.photoURL);
                setAvatarEdit(true);
                setNameEdit(false);
              }}
            />
          </div>
        </div>
      ) :
      (
        <img src={user.photoURL} style={{ height: '70px', borderRadius: '100%' }} alt={user.displayName} title={user.displayName} />
      )
  }

  const renderName = () => {
    return isOwner ?
      (
        <h4 className="profile-name" style={{ marginLeft: '1.5rem' }}>
          {user.displayName}
          <FaEdit
            size="1.3rem"
            onClick={() => {
              setName(user.displayName);
              setNameEdit(true);
              setAvatarEdit(false);
            }}
          />
          <div className="profile-name-edit" style={!nameEdit ? { display: 'none' } : {}}>
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => {
                if (e.charCode === 13 && name.length > 0) {
                  onUpdateProfileName(name);
                  setNameEdit(false);
                }
              }}
            />
            <Button
              icon="pi pi-check"
              style={{ margin: '0 .15rem 0 .25rem' }}
              onClick={() => {
                if (name.length > 0) {
                  onUpdateProfileName(name);
                  setNameEdit(false);
                }
              }}
            />
            <Button icon="pi pi-times" style={{ margin: '0 .15rem' }} onClick={() => setNameEdit(false)} />
          </div>
        </h4>
      ) :
      (
        <h4 className="profile-name">{user.displayName}</h4>
      )
  }

  const renderHideouts = () => {
    return userHideouts.map((h, index) => {
      let hash = null;
      try {
        hash = _.get(JSON.parse(h.fileContent), 'Hideout Hash');
      } catch (e) { console.warn('renderHideouts', e); }

      return (
        <tr key={`profile-list-${h.id}`}>
          <td>{index + 1}</td>
          <td><Link to={`/detail/${h.id}`} alt={h.title} title={h.title}><div className="profile-list-thumbnail" style={{ backgroundImage: `url(${h.thumbnail})` }} /></Link></td>
          <td>{hash ? _.get(hideoutAPI.getByHash(hash, i18n.language), 'Name') : ''}</td>
          <td><p className="profile-list-title">{h.title}</p></td>
          <td>{h.views}</td>
          <td>{h.download}</td>
          <td>{h.favorite}</td>
          <td>{moment(h.update).format('YYYY-MM-DD')}</td>
          <td>
            {
              isOwner ?
                (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to={`/detail/${h.id}`} alt={t('ProfileBrowse')} title={t('ProfileBrowse')}><Button icon="pi pi-external-link" style={{ marginRight: '.25rem', marginBottom: '.08rem' }} /></Link>
                    <Link to={`/edit/${h.id}`} alt={t('ProfileEdit')} title={t('ProfileEdit')}><Button className="p-button-success" icon="pi pi-pencil" style={{ marginRight: '.25rem', marginBottom: '.08rem' }} /></Link>
                    <Button className="p-button-danger" icon="pi pi-trash" alt={t('ProfileDelete')} title={t('ProfileDelete')} onClick={() => window.confirm(`${t('ProfileDeleteQuestion')} 「${h.title}」 ???`) ? onDeleteHideout(h) : null} />
                  </div>
                ) :
                (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to={`/detail/${h.id}`} alt={t('ProfileBrowse')} title={t('ProfileBrowse')}><Button icon="pi pi-external-link" style={{ marginRight: '.25rem', marginBottom: '.08rem' }} /></Link>
                  </div>
                )
            }
          </td>
        </tr>
      );
    })
  }

  return (
    <MasterLayout>
      <div className="profile">
        <div className="profile-form">
          {isLogin ? renderAvatar() : null}
          {isLogin ? renderName() : null}
          {
            userHideouts.length > 0 ?
              (
                <div className="profile-list-container">
                  <table className="profile-list">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('ProfileThumbnail')}</th>
                        <th>{t('ProfileType')}</th>
                        <th>{t('ProfileTitle')}</th>
                        <th><FaEye size="1.3rem" /></th>
                        <th><FaDownload size="1.2rem" /></th>
                        <th><FaHeart size="1rem" /></th>
                        <th>{t('ProfileUpdate')}</th>
                        <th style={{ width: isOwner ? '130px' : '50px' }}>{t('ProfileActoin')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderHideouts()}
                    </tbody>
                  </table>
                </div>
              ) : null
          }
        </div>
      </div>
    </MasterLayout>
  );
}

export default Profile;

// class Profile extends Component {

//   constructor(props) {
//     super(props);
//     this.dispatch = props.dispatch;
//     t = props.t;
//     this.id = props.match.params.id;
//     this.auth = props.auth;
//     this.database = props.database;
//     this.users = props.users;
//     this.hideoutAPI = props.hideoutAPI;
//     this.isOwner = false;
//     this.state = {
//       user: null,
//       Hideouts: [],
//       name: '',
//       nameEdit: false,
//       avatar: '',
//       avatarEdit: false,
//     }
//   }

//   componentWillMount() {
//     this.onCheckIsOwner();
//   }

//   componentDidMount() {
//     // If url has id, then read id or get owner(login) uid
//     const ID = this.id ? this.id : Session.get('auth').uid;

//     this.setState({
//       Hideouts: this.database.getByUserId(ID),
//       user: this.users.getById(ID),
//     });
//   }

//   componentWillReceiveProps() {
//     this.onCheckIsOwner();
//   }

//   componentWillUpdate() {
//     this.onCheckIsOwner();
//   }

//   /**
//    * Check profile page is login user
//    */
//   onCheckIsOwner() {
//     this.id = this.props.match.params.id;

//     // Case: both null (url'id not find, and not login)
//     if (!Session.get('auth') && !this.id) this.props.history.push('/');

//     // Case: url'id not find then re-check the login id
//     if (!this.id) {
//       // if also not login then return
//       if (!Session.get('auth')) this.props.history.push('/');
//       // if login data crash
//       if (!Object.keys(Session.get('auth')).includes('uid')) this.props.history.push('/');
//       return this.isOwner = Session.get('auth') ? true : false;
//     } else {
//       // if not login, just show the profile by url id
//       if (!Session.get('auth')) return this.isOwner = false;
//       // else check the profile if is the owner profile
//       return this.isOwner = Session.get('auth').uid === this.id ? true : false;
//     }
//   }

//   /**
//    * Update avatar or uname
//    * @param {object} payload
//    */
//   async onUpdateProfile(payload = {}) {
//     if (Object.keys(payload).length === 0) return
//     try {
//       const { uid } = Session.get('auth');
//       await this.users.onUpdateUser(uid, payload);
//     } catch (e) { console.warn('onUpdateProfile', e); }
//   }

//   /**
//    * Delete this hideout
//    * @param {object} hideout
//    */
//   async onDeleteHideout(hideout = {}) {
//     if (!_.get(hideout, 'id') && !_.get(hideout, 'fileName')) return;
//     await this.database.onDeleteHideout(hideout.id);
//     this.growl.show({ severity: 'success', summary: 'Delete Hideout', detail: 'Delete successfully.' });
//     // reload profile data
//     const ID = this.id ? this.id : Session.get('auth').uid;
//     this.setState({ Hideouts: this.database.getByUserId(ID) });
//   }

//   /**
//    * Render user avatar
//    * @param {object} user
//    */
//   renderAvatar(user = {}) {
//     return this.isOwner ?
//       (
//         <div>
//           <div className="profile-avatar-edit" style={!this.state.avatarEdit ? { display: 'none' } : {}}>
//             <InputText
//               style={{ width: '300px' }}
//               value={this.state.avatar}
//               onChange={(e) => this.setState({ avatar: e.target.value })}
//               onKeyPress={(e) => {
//                 if (e.charCode === 13 && this.state.avatar.length > 0) {
//                   this.onUpdateProfile({ avatar: this.state.avatar });
//                   this.setState({ avatarEdit: false });
//                 }
//               }}
//             />
//             <Button
//               icon="pi pi-check"
//               style={{ margin: '0 .15rem 0 .25rem' }}
//               onClick={() => {
//                 if (this.state.avatar.length > 0) {
//                   this.onUpdateProfile({ avatar: this.state.avatar });
//                   this.setState({ avatarEdit: false });
//                 }
//               }}
//             />
//             <Button icon="pi pi-times" style={{ margin: '0 .15rem' }} onClick={() => this.setState({ avatarEdit: false })} />
//           </div>
//           <div className="profile-avatar">
//             <img src={user.photoURL} style={{ height: '70px', borderRadius: '100%' }} alt={user.displayName} title={user.displayName} />
//             <FaEdit size="1.3rem" onClick={() => this.setState({ avatarEdit: true, nameEdit: false, avatar: user.photoURL })} />
//           </div>
//         </div>
//       ) :
//       (
//         <img src={user.photoURL} style={{ height: '70px', borderRadius: '100%' }} alt={user.displayName} title={user.displayName} />
//       )
//   }

//   /**
//    * Render user name
//    * @param {object} user
//    */
//   renderName(user = { uname: 'unknown' }) {
//     return this.isOwner ?
//       (
//         <h4 className="profile-name" style={{ marginLeft: '1.5rem' }}>
//           {user.displayName}
//           <FaEdit size="1.3rem" onClick={() => this.setState({ nameEdit: true, avatarEdit: false, name: user.displayName })} />
//           <div className="profile-name-edit" style={!this.state.nameEdit ? { display: 'none' } : {}}>
//             <InputText
//               value={this.state.name}
//               onChange={(e) => this.setState({ name: e.target.value })}
//               onKeyPress={(e) => {
//                 if (e.charCode === 13 && this.state.name.length > 0) {
//                   this.onUpdateProfile({ uname: this.state.name });
//                   this.setState({ nameEdit: false });
//                 }
//               }}
//             />
//             <Button
//               icon="pi pi-check"
//               style={{ margin: '0 .15rem 0 .25rem' }}
//               onClick={() => {
//                 if (this.state.name.length > 0) {
//                   this.onUpdateProfile({ uname: this.state.name });
//                   this.setState({ nameEdit: false });
//                 }
//               }}
//             />
//             <Button icon="pi pi-times" style={{ margin: '0 .15rem' }} onClick={() => this.setState({ nameEdit: false })} />
//           </div>
//         </h4>
//       ) :
//       (
//         <h4 className="profile-name">{user.displayName}</h4>
//       )
//   }

//   /**
//    * Render hideouts
//    * @param {array} hideouts
//    */
//   renderHideouts(hideouts = []) {
//     return hideouts.map((h, index) => {
//       let hash = null;
//       try {
//         hash = _.get(JSON.parse(h.fileContent), 'Hideout Hash');
//       } catch (e) { console.warn('renderHideouts', e); }

//       return (
//         <tr key={`profile-list-${h.id}`}>
//           <td>{index + 1}</td>
//           <td><Link to={`/detail/${h.id}`} alt={h.title} title={h.title}><div className="profile-list-thumbnail" style={{ backgroundImage: `url(${h.thumbnail})` }} /></Link></td>
//           <td>{hash ? _.get(this.hideoutAPI.getByHash(hash, this.props.lng), 'Name') : ''}</td>
//           <td><p className="profile-list-title">{h.title}</p></td>
//           <td>{h.views}</td>
//           <td>{h.download}</td>
//           <td>{h.favorite}</td>
//           <td>{moment(h.update).format('YYYY-MM-DD')}</td>
//           <td>
//             {
//               this.isOwner ?
//                 (
//                   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                     <Link to={`/detail/${h.id}`} alt={t('ProfileBrowse')} title={t('ProfileBrowse')}><Button icon="pi pi-external-link" style={{ marginRight: '.25rem', marginBottom: '.08rem' }} /></Link>
//                     <Link to={`/edit/${h.id}`} alt={t('ProfileEdit')} title={t('ProfileEdit')}><Button className="p-button-success" icon="pi pi-pencil" style={{ marginRight: '.25rem', marginBottom: '.08rem' }} /></Link>
//                     <Button className="p-button-danger" icon="pi pi-trash" alt={t('ProfileDelete')} title={t('ProfileDelete')} onClick={() => window.confirm(`${t('ProfileDeleteQuestion')} 「${h.title}」 ???`) ? this.onDeleteHideout(h) : null} />
//                   </div>
//                 ) :
//                 (
//                   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                     <Link to={`/detail/${h.id}`} alt={t('ProfileBrowse')} title={t('ProfileBrowse')}><Button icon="pi pi-external-link" style={{ marginRight: '.25rem', marginBottom: '.08rem' }} /></Link>
//                   </div>
//                 )
//             }
//           </td>
//         </tr>
//       );
//     })
//   }

//   render() {
//     return (
//       <MasterLayout>
//         <div className="profile">
//           <div className="profile-form">
//             {usr ? this.renderAvatar(usr) : null}
//             {usr ? this.renderName(usr) : null}
//             {
//               this.state.Hideouts.length > 0 ?
//                 (
//                   <div className="profile-list-container">
//                     <table className="profile-list">
//                       <thead>
//                         <tr>
//                           <th>#</th>
//                           <th>{t('ProfileThumbnail')}</th>
//                           <th>{t('ProfileType')}</th>
//                           <th>{t('ProfileTitle')}</th>
//                           <th><FaEye size="1.3rem" /></th>
//                           <th><FaDownload size="1.2rem" /></th>
//                           <th><FaHeart size="1rem" /></th>
//                           <th>{t('ProfileUpdate')}</th>
//                           <th style={{ width: this.isOwner ? '130px' : '50px' }}>{t('ProfileActoin')}</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {this.renderHideouts(this.state.Hideouts)}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : null
//             }
//           </div>
//         </div>
//         <Growl ref={(el) => this.growl = el} />
//       </MasterLayout>
//     );
//   }
// }

// Profile.propTypes = {}

// const mapStateToProps = state => {
//   return {
//     auth: state.auth,
//     firebase: state.firebase,
//     hideoutAPI: state.hideoutAPI,
//     users: state.users,
//   }
// }

// export default withTranslation()(connect(mapStateToProps)(Profile));
