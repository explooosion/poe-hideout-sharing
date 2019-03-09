/* eslint-disable no-useless-escape */

/**
 * Format hideout object to .hideout style
 * @param {object} object
 */
function formatHideoutObject(object = {}) {
  return JSON.stringify(object)
    .replace(/\"/g, '')
    .replace(/\:/g, '=')
    .replace(/\,/g, ', ')
    .replace(/\{/g, '{ ')
    .replace(/\}/g, ' }');

  // Example
  // From:
  // Stash={"Hash":3230065491,"X":177,"Y":122,"Rot":35498,"Flip":0,"Var":0,"Name":"Stash"}
  // To:
  // Stash = { Hash=3230065491, X=177, Y=122, Rot=35498, Flip=0, Var=0 }
}

/**
 * Match img tag to array from form content
 * @param {string} content
 */
function formatImgTagFromContent(content = '') {
  return String(content).match(/<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/g) || [];
}

export {
  formatHideoutObject,
  formatImgTagFromContent,
}
