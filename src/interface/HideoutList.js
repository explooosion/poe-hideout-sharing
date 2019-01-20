import uuid from 'uuid/v1';

import HideoutScreenshot from './HideoutScreenshot';

class HideoutList {

  /**
   * Id
   */
  id = uuid();

  /**
   * Title
   */
  title = 'My-New-Hideout';

  /**
   * Desscription
   */
  description = 'This is a simple hideout.';

  /**
   * Author
   */
  author = '';

  /**
   * Type
   */
  type = '';

  /**
   * Thumnnail
   */
  thumbnail = '';

  /**
   * Favour
   */
  favour = 0;

  /**
   * Version
   */
  version = 1;

  /**
   * Update
   */
  update = '';

  /**
   * Create
   */
  create = '';

  /**
   * Download
   */
  download = 0;

  /**
   * Views
   */
  views = 0;

  /**
   * Favorite
   */
  favorite = 0;

  /**
   * Screenshot List
   */
  screenshots = [HideoutScreenshot];

  /**
   * file name
   */
  fileName = '';

  /**
   * timestamp
   */
  timestamp = null;

  /**
   * Convert to json
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      author: this.author,
      type: this.type,
      thumbnail: this.thumbnail,
      favour: this.favour,
      version: this.version,
      update: this.update,
      create: this.create,
      download: this.download,
      views: this.views,
      favorite: this.favorite,
      screenshots: [],
      fileName: this.fileName,
      timestamp: this.timestamp,
    }
  }
}

export default HideoutList;
