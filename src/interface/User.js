
class User {

  /**
   * User id from google
   */
  uid = '';

  /**
   * User displayname from google
   */
  uname = '';

  /**
   * User avatar from google
   */
  avatar = '';

  /**
   * User email from google
   */
  email = '';

  constructor(uid, uname, avatar, email) {
    this.uid = uid;
    this.uname = uname;
    this.avatar = avatar;
    this.email = email;
  }

  /**
   * Convert to json
   */
  toJSON() {
    return {
      uid: this.uid,
      uname: this.uname,
      avatar: this.avatar,
      email: this.email,
    }
  }
}

export default User;
