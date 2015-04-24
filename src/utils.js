'use strict';

export default {
  /**
   * Get Function.name
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
   *
   * @returns {string}
   */
  extractNameFromFunction(func) {
    return func.toString().match(/^function\s*([^\s(]+)/)[1];
  }
};
