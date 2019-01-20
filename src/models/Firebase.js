import Database from '../service/Database';
import Storage from '../service/Storage';

const database = new Database();
const storage = new Storage();

export default {
  database,
  storage,
};
