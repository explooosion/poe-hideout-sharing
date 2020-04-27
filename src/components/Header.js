import React, { Component } from 'react';
import './Header.scss';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { MdNoteAdd } from 'react-icons/md';
import { IoLogoGithub } from 'react-icons/io';
import { GiExitDoor, GiEntryDoor } from 'react-icons/gi';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';

import Session from '../service/Session';
import { setLocal } from '../actions';
import logo from '../images/logo.svg';

class Header extends Component {

  constructor(props) {
    super(props);
    const { locale } = props.settings;
    // this.dispatch = props.dispatch;
    this.t = props.t;
    // this.auth = props.auth;
    this.state = {
      visible: false,
      items: [
        { label: 'Create', icon: 'pi pi-fw pi-plus', command: () => this.props.history.push('/create') },
        { label: 'Github', icon: 'pi pi-fw pi-star', command: () => { window.open('https://github.com/explooosion/poe-hideout-sharing'); } },
        // { label: 'Login', icon: 'pi pi-fw pi-globe', command: () => this.props.history.push('/loginn') },
      ],
      locale: locale,
      locales: [
        { label: 'EN', value: 'en', icon: 'us' },
        { label: 'TW', value: 'zhTW', icon: 'tw' },
        { label: 'CN', value: 'zhCN', icon: 'cn' },
      ],
    };
  }

  componentWillMount() {
    this.onChangeLanguage(this.state.locale);
  }

  onChangeLanguage(value) {
    this.dispatch(setLocal(value));
    this.setState({ locale: value });
  }

  async onLogout() {
    await this.auth.onLogout();
    window.location.href = '/';
  }

  renderFlagTemplate(option) {
    return (
      <div className="p-clearfix flag-group">
        <span className={`flag-icon flag-icon-${option.icon}`}></span>
        <span className="flag-name">{option.label}</span>
      </div>
    );
  }

  render() {
    const auth = Session.get('auth');
    return (
      <nav className="nav">
        <header className="header">
          <Link to="/" className="menu-button" onClick={() => this.setState({ visible: true })}>
            <i className="pi pi-bars" />
          </Link>
          {
            // this.props.database.get() ?
            //   (
            //     <Link to="/" className="logo">
            //       <img className="logo-img" alt="logo" title="logo" src={logo} />
            //       <span className="logo-title">POEHoS</span>
            //     </Link>
            //   ) :
            (
              <a href="/" className="logo">
                <img className="logo-img" alt="logo" title="logo" src={logo} />
                <span className="logo-title">POEHoS</span>
              </a>
            )
          }
          <div className="mobile-menu">
            <Menu model={this.state.items} popup={true} ref={el => this.menu = el} />
            <Button className="p-button-secondary" icon="pi pi-bars" onClick={(event) => this.menu.toggle(event)} />
          </div>
          <ul className="topbar-menu">
            {
              auth
                ? <li><Link to={`/profile/${auth.uid}`}><img src={auth.avatar} style={{ width: '30px', borderRadius: '100%' }} alt={auth.uname} title={auth.uname} /></Link></li>

                : null
            }
            <li><Link to="/create" alt={this.t('HeaderCreate')} title={this.t('HeaderCreate')}><MdNoteAdd size="2rem" /></Link></li>
            {
              auth
                ? <li><a href="#logout" onClick={() => this.onLogout()} alt={this.t('HeaderLogout')} title={this.t('HeaderLogout')}><GiExitDoor size="2rem" /></a></li>
                : <li><Link to="/login" alt={this.t('HeaderLogin')} title={this.t('HeaderLogin')}><GiEntryDoor size="2rem" /></Link></li>
            }
            <li><a href="https://github.com/explooosion/poe-hideout-sharing" target="_blank" rel="noopener noreferrer" alt={this.t('HeaderGithub')} title={this.t('HeaderGithub')}><IoLogoGithub size="2rem" /></a></li>
            <li style={{ paddingLeft: '1rem', height: 'auto' }}>
              <Dropdown
                value={this.state.locale}
                options={this.state.locales}
                onChange={e => this.onChangeLanguage(e.value)}
                itemTemplate={this.renderFlagTemplate}
              />
            </li>
          </ul>
        </header>
        <Sidebar visible={this.state.visible} onHide={() => this.setState({ visible: false })}></Sidebar>
      </nav>
    );
  }
}

Header.propTypes = {}

const mapStateToProps = state => {
  return {
    // settings: state.settings,
    // database: state.database,
    // auth: state.auth,
  }
}

export default withTranslation()(connect(mapStateToProps)(withRouter(Header)));
