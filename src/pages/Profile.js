/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { rgba, transitions } from 'polished';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaEye, FaDownload, FaEdit } from 'react-icons/fa';
import moment from 'moment';
import _ from 'lodash';

import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import MasterLayout from '../layout/MasterLayout';

import HideoutAPI from '../service/HideoutAPI';

import { deleteHideout, updateUser } from '../actions';

import bg from '../images/bg.jpg';

const hideoutAPI = new HideoutAPI();

const Main = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: calc(100vh - ${p => p.theme.headerHeight});
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
`;

const Form = styled.div`
  position: relative;
  margin-top: 2rem;
  padding: 1rem 0;
  overflow: hidden;
  width: ${p => p.theme.screenLg};
  height: calc(90vh - ${p => p.theme.headerHeight});
  text-align: center;
  background-color: ${p => rgba(p.theme.dark, .85)};
  border: 2px solid ${p => p.theme.gray};
`;

const ListContainer = styled.div`
  overflow: auto;
  padding-bottom: 10rem;
  height: 100%;
`;

const Table = styled.table`
  margin: 0 auto;
  width: 90%;
  border-collapse: collapse;
  color: #fff;

  th {
    font-family: ${p => p.theme.headerFont};
  }

  th,
  td {
    padding: .75rem .5rem;
  }

  tr:not(:last-child) td {
    border-bottom: 1px solid ${p => p.theme.gray};
  }

  thead,
  tbody {
    border-bottom: 1px solid #fff;
  }
`;

const Thumbnail = styled.div`
  margin: 0 auto;
  width: 80px;
  height: 60px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;

const Title = styled.p`
  overflow: hidden;
  max-width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Avatar = styled.div`
  overflow: hidden;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: flex-end;
  border-radius: 100%;

  &:hover::after,
  &:hover svg {
    opacity: 1;
    cursor: pointer;
  }

  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 25px;
    background: ${rgba('#222', .5)};
    opacity: 0;
    transition: all .2s ease-in-out;
  }

  svg {
    position: absolute;
    bottom: 3px;
    color: ${p => p.theme.warning};
    z-index: 1;
    opacity: 0;
    ${transitions('opacity', '.2s ease-in-out')};
  }
`;

const AvatarEdit = styled.div`
  position: absolute;
  top: 90px;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Name = styled.h4`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: .5rem;
  color: #fff;
  border-bottom: 1px solid ${p => p.theme.gray};
  user-select: none;

  &:hover svg {
    opacity: 1;
  }

  svg {
    margin-left: .25rem;
    color: ${p => p.theme.warning};
    opacity: 0;
    cursor: pointer;
  }

  &::before {
    content: '@';
  }
`;

const NameEdit = styled.div`
  position: absolute;
  top: 0;
  left: 40%;
`;

let growl;

function Profile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { hideouts, users } = useSelector(state => state.firebase);
  const { isLogin, user: USER } = useSelector(state => state.auth);

  const [uname, setUName] = useState('');
  const [unameEdit, setUNameEdit] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [avatarEdit, setAvatarEdit] = useState(false);

  let targetId = id;
  if (isLogin && (id === USER.uid || _.isUndefined(id))) {
    targetId = USER.uid;
  }

  const isOwner = targetId === USER.uid;
  const user = users.find(u => u.uid === targetId) || { uname: '', avatar: '' };

  const userHideouts = hideouts.filter(h => h.authorId === targetId);

  useEffect(() => {
    setUName(user.uname);
    setAvatar(user.avatar);
  }, [user]);

  const onUpdateProfile = () => {
    const payload = { ...user, uname, avatar };
    // console.log('onUpdateProfile', payload);
    dispatch(updateUser(payload));
  }

  const onDeleteHideout = hideout => {
    // console.log('onDeleteHideout', hideout);
    dispatch(deleteHideout(hideout));
    growl.show({ severity: 'success', summary: 'Delete Hideout', detail: 'Delete successfully.' });
  }

  const renderAvatar = () => {
    return isOwner ?
      (
        <div>
          <AvatarEdit style={!avatarEdit ? { display: 'none' } : {}}>
            <InputText
              style={{ width: '300px' }}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              onKeyPress={(e) => {
                if (e.charCode === 13 && avatar.length > 0) {
                  onUpdateProfile();
                  setAvatarEdit(false);
                }
              }}
            />
            <Button
              icon="pi pi-check"
              style={{ margin: '0 .15rem 0 .25rem' }}
              onClick={() => {
                if (avatar.length > 0) {
                  onUpdateProfile();
                  setAvatarEdit(false);
                }
              }}
            />
            <Button icon="pi pi-times" style={{ margin: '0 .15rem' }} onClick={() => setAvatarEdit(false)} />
          </AvatarEdit>
          <Avatar>
            <img src={user.avatar} style={{ height: '70px', borderRadius: '100%' }} alt={user.uname} title={user.uname} />
            <FaEdit
              size="1.3rem"
              onClick={() => {
                setAvatar(user.avatar);
                setAvatarEdit(true);
                setUNameEdit(false);
              }}
            />
          </Avatar>
        </div>
      ) :
      (
        <img src={user.avatar} style={{ height: '70px', borderRadius: '100%' }} alt={user.uname} title={user.uname} />
      )
  }

  const renderName = () => {
    return isOwner ?
      (
        <Name style={{ marginLeft: '1.5rem' }}>
          {user.uname}
          <FaEdit
            size="1.3rem"
            onClick={() => {
              setUName(user.uname);
              setUNameEdit(true);
              setAvatarEdit(false);
            }}
          />
          <NameEdit style={!unameEdit ? { display: 'none' } : {}}>
            <InputText
              value={uname}
              onChange={(e) => setUName(e.target.value)}
              onKeyPress={(e) => {
                if (e.charCode === 13 && uname.length > 0) {
                  onUpdateProfile();
                  setUNameEdit(false);
                }
              }}
            />
            <Button
              icon="pi pi-check"
              style={{ margin: '0 .15rem 0 .25rem' }}
              onClick={() => {
                if (uname.length > 0) {
                  onUpdateProfile();
                  setUNameEdit(false);
                }
              }}
            />
            <Button icon="pi pi-times" style={{ margin: '0 .15rem' }} onClick={() => setUNameEdit(false)} />
          </NameEdit>
        </Name>
      ) :
      (
        <Name>{user.uname}</Name>
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
          <td><Link to={`/detail/${h.id}`} alt={h.title} title={h.title}><Thumbnail style={{ backgroundImage: `url(${h.thumbnail})` }} /></Link></td>
          <td>{hash ? _.get(hideoutAPI.getByHash(hash, i18n.language), 'Name') : ''}</td>
          <td><Title>{h.title}</Title></td>
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
      <Main>
        <Form>
          {renderAvatar()}
          {renderName()}
          {
            <ListContainer>
              <Table>
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
              </Table>
            </ListContainer>
          }
        </Form>
      </Main>
      <Growl ref={el => growl = el} />
    </MasterLayout>
  );
}

export default Profile;
