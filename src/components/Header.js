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
          <a
            className="menu-button"
            href="./"
            onClick={e => this.setState({ visible: true })}
          >
            <i className="pi pi-bars" />
          </a>
          <a className="logo" href="./">
            <img className="logo-img" alt="logo" title="logo" src={logo} />
            <span className="logo-title">Path Of Exile</span>
          </a>
          <ul className="topbar-menu">
            <Link to="/detail">
              <li>
                <a href="#">DETAIL</a>
              </li>
            </Link>
            <Link to="/">
              <li>
                <a href="#">HOME</a>
              </li>
            </Link>
            <Link to="/about">
              <li>
                <a href="#">ABOUT</a>
              </li>
            </Link>
            <Link to="/login">
              <li>
                <a href="#">LOGIN</a>
              </li>
            </Link>
          </ul>
        </header>
        <Sidebar visible={this.state.visible} onHide={e => this.setState({ visible: false })}>
        </Sidebar>
      </nav>
    );
  }
}

export default Header;
