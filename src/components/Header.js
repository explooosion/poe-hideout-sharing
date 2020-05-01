import React, { useState } from 'react';
import './Header.scss';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { MdNoteAdd } from 'react-icons/md';
import { IoLogoGithub } from 'react-icons/io';
import { GiExitDoor, GiEntryDoor } from 'react-icons/gi';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';

import { setLocal, logoutUser } from '../actions';
import logo from '../images/logo.svg';

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

  const onLogout = () =>  dispatch(logoutUser());

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
    <nav className="nav">
      <header className="header">
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
      </header>
      <Sidebar visible={visible} onHide={() => setVisible(false)}></Sidebar>
    </nav>
  );
}

export default Header;

// class Header extends Component {

//   constructor(props) {
//     super(props);
//     const { locale } = props.settings;
//     // this.dispatch = props.dispatch;
//     t = props.t;
//     // this.auth = props.auth;
//     this.state = {
//       visible: false,
//       items: [
//         { label: 'Create', icon: 'pi pi-fw pi-plus', command: () => this.props.history.push('/create') },
//         { label: 'Github', icon: 'pi pi-fw pi-star', command: () => { window.open('https://github.com/explooosion/poe-hideout-sharing'); } },
//         // { label: 'Login', icon: 'pi pi-fw pi-globe', command: () => this.props.history.push('/loginn') },
//       ],
//       locale: locale,
//       locales: [
//         { label: 'EN', value: 'en', icon: 'us' },
//         { label: 'TW', value: 'zhTW', icon: 'tw' },
//         { label: 'CN', value: 'zhCN', icon: 'cn' },
//       ],
//     };
//   }

//   componentWillMount() {
//     this.onChangeLanguage(locale);
//   }

//   onChangeLanguage(value) {
//     this.dispatch(setLocal(value));
//     this.setState({ locale: value });
//   }

//   async onLogout() {
//     await this.auth.onLogout();
//     window.location.href = '/';
//   }

//   renderFlagTemplate(option) {
//     return (
//       <div className="p-clearfix flag-group">
//         <span className={`flag-icon flag-icon-${option.icon}`}></span>
//         <span className="flag-name">{option.label}</span>
//       </div>
//     );
//   }

//   render() {
//     const auth = Session.get('auth');
//     return (
//       <nav className="nav">
//         <header className="header">
//           <Link to="/" className="menu-button" onClick={() => this.setState({ visible: true })}>
//             <i className="pi pi-bars" />
//           </Link>
//           {
//             // this.props.database.get() ?
//             //   (
//             //     <Link to="/" className="logo">
//             //       <img className="logo-img" alt="logo" title="logo" src={logo} />
//             //       <span className="logo-title">POEHoS</span>
//             //     </Link>
//             //   ) :
//             (
//               <a href="/" className="logo">
//                 <img className="logo-img" alt="logo" title="logo" src={logo} />
//                 <span className="logo-title">POEHoS</span>
//               </a>
//             )
//           }
//           <div className="mobile-menu">
//             <Menu model={items} popup={true} ref={el => this.menu = el} />
//             <Button className="p-button-secondary" icon="pi pi-bars" onClick={(event) => this.menu.toggle(event)} />
//           </div>
//           <ul className="topbar-menu">
//             {
//               auth
//                 ? <li><Link to={`/user/${auth.uid}`}><img src={auth.avatar} style={{ width: '30px', borderRadius: '100%' }} alt={auth.uname} title={auth.uname} /></Link></li>

//                 : null
//             }
//             <li><Link to="/create" alt={t('HeaderCreate')} title={t('HeaderCreate')}><MdNoteAdd size="2rem" /></Link></li>
//             {
//               auth
//                 ? <li><a href="#logout" onClick={() => this.onLogout()} alt={t('HeaderLogout')} title={t('HeaderLogout')}><GiExitDoor size="2rem" /></a></li>
//                 : <li><Link to="/login" alt={t('HeaderLogin')} title={t('HeaderLogin')}><GiEntryDoor size="2rem" /></Link></li>
//             }
//             <li><a href="https://github.com/explooosion/poe-hideout-sharing" target="_blank" rel="noopener noreferrer" alt={t('HeaderGithub')} title={t('HeaderGithub')}><IoLogoGithub size="2rem" /></a></li>
//             <li style={{ paddingLeft: '1rem', height: 'auto' }}>
//               <Dropdown
//                 value={locale}
//                 options={locales}
//                 onChange={e => this.onChangeLanguage(e.value)}
//                 itemTemplate={this.renderFlagTemplate}
//               />
//             </li>
//           </ul>
//         </header>
//         <Sidebar visible={visible} onHide={() => this.setState({ visible: false })}></Sidebar>
//       </nav>
//     );
//   }
// }

// Header.propTypes = {}

// const mapStateToProps = state => {
//   return {
//     settings: state.settings,
//     // firebase: state.firebase,
//     // auth: state.auth,
//   }
// }

// export default withTranslation()(connect(mapStateToProps)(withRouter(Header)));
