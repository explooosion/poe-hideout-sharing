import Database from '../service/Database';
import Storage from '../service/Storage';
import Auth from '../service/Auth';

const database = new Database();
const storage = new Storage();
const auth = new Auth();

export default {
  database,
  storage,
  auth,
};
