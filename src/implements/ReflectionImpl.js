'use strict';

/**
 * @class ReflectionImpl
 */
export default class ReflectionImpl {

  /**
   * Get Function.name
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
   *
   * @returns {string}
   */
  static getClassName() {
    if (!this.constructor.name) {
      this.constructor.name = utils.extractNameFromFunction(this.constructor);
    }

    return this.constructor.name;
  }
}
