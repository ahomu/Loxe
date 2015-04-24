'use strict';

import utils from '../utils';

/**
 * @class Store
 */
export default class Store {

  /**
   * @type {Object<string, function>} dispatchReceiver
   */
  dispatchReceiver = {};

  /**
   * Get Function.name
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
   *
   * @returns {string}
   */
  getClassName() {
    if (!this.constructor.name) {
      this.constructor.name = utils.extractNameFromFunction(this.constructor);
    }

    return this.constructor.name;
  }
}
