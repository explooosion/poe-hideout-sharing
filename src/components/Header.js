import React, { useState } from 'react';
import './Header.scss';
import styled from 'styled-components';
import { rgba, transitions } from 'polished';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { MdNoteAdd } from 'react-icons/md';
import { IoLogoGithub } from 'react-icons/io';
import { GiExitDoor, GiEntryDoor } from 'react-icons/gi';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';

import { setLocal, logoutUser } from '../actions';

import logo from '../images/logo.svg';

const Nav = styled.nav`
`;

const Head = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${p => p.theme.headerHeight};
  text-align: left;
  background-color: ${p => rgba(p.theme.lightBlack, .95)};
  border-bottom: 2px solid ${p => p.theme.black};
  z-index: 999;

  .menu-button {
    /* // display: inline-block; */
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    width: ${p => p.theme.headerHeight};
    height: ${p => p.theme.headerHeight};
    font-size: 24px;
    line-height: ${p => p.theme.headerHeight};
    text-align: center;
    cursor: pointer;
    ${transitions('background-color', '.2s')};

    > i {
      line-height: inherit;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    margin-left: 2rem;

    .logo-img {
      width: 50px;
    }

    .logo-title {
      margin-left: 5px;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      font-family: Lobster Two, cursive;
    }
  }

  .mobile-menu {
    display: none;

    @media only screen and (max-width: ${p => p.theme.screenLg}) {
      display: inline;
      margin-right: 1rem;
    }
  }

  .topbar-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2rem 0 0;
    padding: 0;
    height: 100%;
    list-style-type: none;

    @media only screen and (max-width: ${p => p.theme.screenLg}) {
      display: none;
    }

    > li {
      display: inline-block;
      height: 100%;

      .flag-group {
        display: flex;
        justify-content: left;
        align-items: center;

        .flag-name {
          margin-left: 5px;
        }
      }

      > a {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 60px;
        height: 100%;
        color: #fff;
        text-decoration: none;
        ${transitions('background-color', '.2s')};
        cursor: pointer;

        &:hover {
          background-color: ${p => p.theme.gray};
        }
      }
    }
  }
`;

function Header() {
  const { t } = useTranslation();
  const history = useHistory();

  const { locale } = useSelector(state => state.settings);
  const { isLogin, user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const items = [
    { label: 'Create', icon: 'pi pi-fw pi-plus', command: () => history.push('/create') },
    { label: 'Github', icon: 'pi pi-fw pi-star', command: () => { window.open('https://github.com/explooosion/poe-hideout-sharing'); } },
  ];

  const locales = [
    { label: 'EN', value: 'US', icon: 'us' },
    { label: 'TW', value: 'TW', icon: 'tw' },
    { label: 'CN', value: 'CN', icon: 'cn' },
  ]

  const onLogout = () => dispatch(logoutUser(history));

  const onChangeLanguage = value => dispatch(setLocal(value));

  const renderFlagTemplate = option => {
    return (
      <div className="p-clearfix flag-group">
        <span className={`flag-icon flag-icon-${option.icon}`}></span>
        <span className="flag-name">{option.label}</span>
      </div>
    );
  }

  return (
    <Nav>
      <Head>
        <Link to="/" className="menu-button" onClick={() => setVisible(true)}>
          <i className="pi pi-bars" />
        </Link>
        <a href="/" className="logo">
          <img className="logo-img" alt="logo" title="logo" src={logo} />
          <span className="logo-title">POEHoS</span>
        </a>
        <div className="mobile-menu">
          <Menu model={items} popup={true} /* ref={el => this.menu = el} */ />
          <Button className="p-button-secondary" icon="pi pi-bars" /* onClick={(event) => this.menu.toggle(event)} */ />
        </div>
        <ul className="topbar-menu">
          {
            isLogin
              ? <li><Link to={`/profile/${user.uid}`}><img src={user.photoURL} style={{ width: '30px', borderRadius: '100%' }} alt={user.displayName} title={user.displayName} /></Link></li>
              : null
          }
          <li><Link to="/create" alt={t('HeaderCreate')} title={t('HeaderCreate')}><MdNoteAdd size="2rem" /></Link></li>
          {
            isLogin
              ? <li><a href="#logout" onClick={() => onLogout()} alt={t('HeaderLogout')} title={t('HeaderLogout')}><GiExitDoor size="2rem" /></a></li>
              : <li><Link to="/login" alt={t('HeaderLogin')} title={t('HeaderLogin')}><GiEntryDoor size="2rem" /></Link></li>
          }
          <li><a href="https://github.com/explooosion/poe-hideout-sharing" target="_blank" rel="noopener noreferrer" alt={t('HeaderGithub')} title={t('HeaderGithub')}><IoLogoGithub size="2rem" /></a></li>
          <li style={{ paddingLeft: '1rem', height: 'auto' }}>
            <Dropdown
              value={locale}
              options={locales}
              onChange={e => onChangeLanguage(e.value)}
              itemTemplate={renderFlagTemplate}
            />
          </li>
        </ul>
      </Head>
      <Sidebar visible={visible} onHide={() => setVisible(false)}></Sidebar>
    </Nav>
  );
}

export default Header;
