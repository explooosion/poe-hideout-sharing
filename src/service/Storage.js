import { v1 as uuid } from 'uuid';

import { storage, REF_PICK } from './config';

/**
 * @deprecated
 */
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
  async onUploadHideout(file = {}) {
    try {
      const { extension } = file;
      // Check file extension
      if (extension !== 'hideout') {
        console.error('Please check your file extension.');
        return { status: false };
      }

      // Upload file
      const fileName = `${uuid()}.${extension}`;
      return this.hideoutRef.child(fileName)
        .put(file).then(snapshot => {
          return snapshot.state === 'success'
            ? { status: true, fileName }
            : { status: false };
        });
    } catch (e) {
      console.error('Please check your file.');
      return { status: false };
    }
  }

  /**
   * Delete file
   * @param {string} fileName
   */
  async onDeleteHideout(fileName = '') {
    if (fileName.length === 0) return;
    await this.hideoutRef.child(fileName).delete().catch(e => console.error('onDeleteHideout', e));
  }

  /**
   * Get hideout file link
   * @param {string} fileName
   */
  async getHideoutLink(fileName = '') {
    if (fileName.length === 0) return;
    return this.hideoutRef.child(fileName).getDownloadURL()
      .then(url => url)
      .catch(e => e);
  }
}

export default Storage;
