import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
// import { Menu } from 'primereact/menu';
import { Link } from 'react-router-dom';

import './Header.scss';

import logo from '../images/logo_poe.png';

class Header extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
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
            <span className="logo-title">Path Of Exile</span>
          </Link>
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
