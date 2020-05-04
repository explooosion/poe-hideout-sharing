import Home from '../pages/Home';
import Detail from '../pages/Detail';
import Login from '../pages/Login';
import Create from '../pages/Create';
import Profile from '../pages/Profile';

export default [
  {
    key: 'root',
    path: '/',
    exact: true,
    component: Home,
    title: 'RouteRoot',
    auth: false,
  },
  {
    key: 'profile',
    path: '/profile',
    exact: true,
    component: Profile,
    title: 'RouteProfile',
    auth: true,
  },
  {
    key: 'profile_id',
    path: '/profile/:id',
    exact: true,
    component: Profile,
    title: 'RouteProfile',
    auth: false,
  },
  {
    key: 'login',
    path: '/login',
    exact: true,
    component: Login,
    title: 'RouteLogin',
    auth: false,
  },
  {
    key: 'create',
    path: '/create',
    exact: true,
    component: Create,
    title: 'RouteCreate',
    auth: false,
  },
  {
    key: 'edit_id',
    path: '/edit/:id',
    exact: true,
    component: Create,
    title: 'RouteEdit',
    auth: true,
  },
  {
    key: 'detail_id',
    path: '/detail/:id',
    exact: true,
    component: Detail,
    title: 'RouteDetail',
    auth: false,
  },
]
