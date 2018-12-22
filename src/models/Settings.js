import Cookies from 'js-cookie';

const Settings = {
  locale: Cookies.get('locale') !== 'undefined' ? Cookies.get('locale') : 'en',
};

export default Settings;
