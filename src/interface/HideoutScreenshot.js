class HideoutScreenshot {

  /**
   * Image or video link
   */
  url = '';

  /**
   * Image r youtube
   */
  type = '';

  /**
   * Message
   */
  atl = '';

  /**
   * Hideout screenshopt
   * @param {string} url
   * @param {string} type
   */
  constructor(url, type) {
    this.url = url;
    this.type = type;
  }

  /**
   * Convert to json format
   */
  toJSON() {
    return {
      url: this.url,
      type: this.type,
      alt: this.atl,
    };
  }
}

export default HideoutScreenshot;
