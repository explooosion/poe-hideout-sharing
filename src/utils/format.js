/* eslint-disable no-useless-escape */
import _ from 'lodash';

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
 * Match img tag to array from form content in create page
 * @param {string} content
 */
function formatImgTagFromContent(content = '') {
  return String(content).match(/<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/g) || [];
}

/**
 * Format hideout file from database fileContent
 * @param {string} content
 */
function formatHideoutFromFileContent(content = '') {
  // Rebuild Constructor
  try {
    const { Objects, ...Args } = JSON.parse(content);
    const Title = Object.keys(Args).map(o => {
      return (`${o} = ${o === 'Hideout Hash' ? _.get(Args, o) : JSON.stringify(_.get(Args, o))}\n`);
    })
    const Files = Objects.map(o => {
      const { Name, ...args } = o;
      return `${Name} = ${formatHideoutObject(args)}\n`;
    });
    // Combine hideout object
    return [...Title, ['\n'], ...Files].join('');
  } catch (e) {
    console.warn('formatHideoutFromFileContent', e);
    return '';
  }
}

export {
  formatHideoutObject,
  formatImgTagFromContent,
  formatHideoutFromFileContent,
}
