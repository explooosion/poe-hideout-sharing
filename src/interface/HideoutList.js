import uuid from 'uuid/v1';

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
   * AuthorId
   */
  authorId = '';

  /**
   * Thumnnail
   */
  thumbnail = '';

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
   * File content
   */
  fileContent = '';

  /**
   * Form content
   */
  formContent = '';

  /**
   * timestamp
   */
  timestamp = null;
}

export default HideoutList;
