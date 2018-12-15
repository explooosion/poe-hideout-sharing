import React, { Component } from 'react';
import './Header.scss';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

import { Link } from 'react-router-dom';

import logo from '../images/logo.svg';

class Header extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
      items: [
        { label: 'Home', icon: 'pi pi-fw pi-home', command: () => { window.location.pathname = '/'; } },
        // { label: 'About', icon: 'pi pi-fw pi-info', command: () => { window.location.pathname = '/about'; } },
        { label: 'Github', icon: 'pi pi-fw pi-star', command: () => { window.open('https://github.com/explooosion/poe-hideout-sharing'); } },
        { label: 'Login', icon: 'pi pi-fw pi-globe', command: () => { window.location.pathname = '/login'; } },
      ],
    };
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
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/about">ABOUT</Link></li>
            <li><a href="https://github.com/explooosion/poe-hideout-sharing" target="_blank" rel="noopener noreferrer">GITHUB</a></li>
            <li><Link to="/login">LOGIN</Link></li>
          </ul>
        </header>
        <Sidebar visible={this.state.visible} onHide={e => this.setState({ visible: false })}>
        </Sidebar>
      </nav>
    );
  }
}

export default Header;
