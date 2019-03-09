import store from 'store2';
import cryptico from 'cryptico';
import iconv from 'iconv-lite';

const ENCODING = 'Big5';
const PR_K = process.env.REACT_APP_SESSION_PRIVATE_KEY;
const BITS = 1024;
const RSAkey = cryptico.generateRSAKey(PR_K, BITS);
const PB_K = cryptico.publicKeyString(RSAkey);

const encodingExists = () => {
  return iconv.encodingExists(ENCODING);
}

const encode = (content = '') => {
  return iconv.encode(content, ENCODING);
}

const decode = (content = Buffer) => {
  return iconv.decode(content, ENCODING);
}

/**
 * Set session
 * @param {string} key
 * @param {any} value
 */
const set = (key = '', value = null) => {
  if (!key && !value) return;
  if (value === null || value === undefined || !value || value === '' || !encodingExists()) {
    // Null, undfined, false will not be encrypt
    store.session(key, value);
  } else {
    store.session(key, cryptico.encrypt(JSON.stringify(encode(JSON.stringify(value))), PB_K).cipher);
  }
}

/**
 * Get session
 * @param {string} key
 */
const get = (key = '') => {
  try {
    const en = store.session(key);
    // Undefined session
    if (!en) return null;

    const { status, plaintext } = cryptico.decrypt(en, RSAkey);
    // Decrypt failure then return false
    if (status === 'failure') return null;
    return encodingExists() ? JSON.parse(decode(Buffer.from(JSON.parse(plaintext)))) : plaintext;
  } catch (e) { return null; }
}

export default {
  set,
  get,
}
