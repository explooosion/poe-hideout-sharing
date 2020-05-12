import { v1 as uuid } from 'uuid';

export default class HideoutList {

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
   * @deprecated
   */
  // version = 1;

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

  /**
   * Enable Visible
   */
  enable = true;
}
