import React, { Component } from 'react';
import './Header.scss';

import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';

import { setLocal } from '../actions';
import logo from '../images/logo.svg';

class Header extends Component {

  constructor(props) {
    super(props);
    const { locale } = this.props.settings;
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.state = {
      visible: false,
      items: [
        { label: 'Home', icon: 'pi pi-fw pi-home', command: () => { window.location.pathname = '/'; } },
        { label: 'About', icon: 'pi pi-fw pi-info', command: () => { /* window.location.pathname = '/about'; */ } },
        { label: 'Github', icon: 'pi pi-fw pi-star', command: () => { window.open('https://github.com/explooosion/poe-hideout-sharing'); } },
        // { label: 'Login', icon: 'pi pi-fw pi-globe', command: () => { window.location.pathname = '/login'; } },
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
    this.setState({ locale: value },
      () => this.dispatch(setLocal(this.state.locale)));
  }

  renderHideoutTemplate(option) {
    return (
      <div className="p-clearfix flag-group">
        <span className={`flag-icon flag-icon-${option.icon}`}></span>
        <span className="flag-name">{option.label}</span>
      </div>
    );
  }

  render() {
    return (
      <nav className="nav">
        <header className="header">
          <Link
            to="/"
            className="menu-button"
            onClick={e => this.setState({ visible: true })}
          >
            <i className="pi pi-bars" />
          </Link>
          <Link to="/" className="logo">
            <img className="logo-img" alt="logo" title="logo" src={logo} />
            <span className="logo-title">POEHoS</span>
          </Link>
          <div className="mobile-menu">
            <Menu model={this.state.items} popup={true} ref={el => this.menu = el} />
            <Button className="p-button-secondary" icon="pi pi-bars" onClick={(event) => this.menu.toggle(event)} />
          </div>
          <ul className="topbar-menu">
            <li><Link to="/">{this.t('HeaderHome')}</Link></li>
            <li><Link to="/">{this.t('HeaderAbout')}</Link></li>
            { /* <li><Link to="/about">ABOUT</Link></li> */}
            <li><a href="https://github.com/explooosion/poe-hideout-sharing" target="_blank" rel="noopener noreferrer">{this.t('HeaderGithub')}</a></li>
            { /* <li><Link to="/login">LOGIN</Link></li> */}
            <li className="locale-menu">
              <Dropdown
                value={this.state.locale}
                options={this.state.locales}
                onChange={(e) => this.onChangeLanguage(e.value)}
                placeholder="Select a City"
                itemTemplate={this.renderHideoutTemplate}
              />
            </li>
          </ul>
        </header>
        <Sidebar visible={this.state.visible} onHide={e => this.setState({ visible: false })}>
        </Sidebar>
      </nav>
    );
  }
}

Header.propTypes = {}

const mapStateToProps = state => {
  return {
    hideouts: state.hideouts,
    settings: state.settings,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Header));
