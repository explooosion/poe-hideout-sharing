import store from 'store2';
import cryptico from 'cryptico';

const PR_K = 'POE_HIDEOUT_@_ROBBY_^Q^';
const BITS = 1024;
const RSAkey = cryptico.generateRSAKey(PR_K, BITS);
const PB_K = cryptico.publicKeyString(RSAkey);

/**
 * Set session
 * @param {string} key
 * @param {any} value
 */
const set = (key = '', value = null) => {
  if (!key && !value) return;
  if (value === null || value === undefined || !value || value === '') {
    // Null, undfined, false will not be encrypt
    store.session(key, value);
  } else {
    store.session(key, cryptico.encrypt(JSON.stringify(value), PB_K).cipher);
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
    // If auth then convert to json
    if (key === 'auth') return JSON.parse(plaintext);
    // Default return
    return plaintext;
  } catch (e) { return null; }
}

export default {
  set,
  get,
}
