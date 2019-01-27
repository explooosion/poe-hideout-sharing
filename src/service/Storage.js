import uuid from 'uuid/v1';

import { storage, REF_PICK } from './config';

class Storage {
  constructor() {
    this.storage = storage;
    this.storageRef = this.storage.ref();
    this.hideoutRef = this.storageRef.child(`hideouts${REF_PICK}`);
  }

  /**
   * Upload hideout file
   * @param {FILE} file
   */
  async uploadHideout(file) {
    try {
      const { extension } = file;
      if (extension !== 'hideout') {
        console.error('Please check your file extension.');
        return { status: false };
      }
      const fileName = `${uuid()}.${extension}`;
      return this.hideoutRef.child(fileName)
        .put(file).then(snapshot => {
          const { state } = snapshot;
          console.log('Upload', snapshot);
          return state === 'success'
            ? { status: true, fileName }
            : { status: false };
          // Debug for download
          // return this.hideoutRef.child(fileName).getDownloadURL()
          //   .then(url => { return { status: true, url, fileName } })
          //   .catch(e => { console.error(e); return { status: false, error: e } });
        });
    } catch (e) {
      console.error('Please check your file.');
      return { status: false };
    }
  }

  /**
   * Get hideout file link
   * @param {string} fileName
   */
  async getHideoutLink(fileName) {
    return this.hideoutRef.child(fileName).getDownloadURL()
      .then(url => url)
      .catch(e => e);
  }
}

export default Storage;
