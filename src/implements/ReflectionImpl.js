'use strict';

/**
 * @class ReflectionImpl
 */
export default class ReflectionImpl {

  /**
   * Get `Function#name`
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
   *
   * @returns {string}
   */
  static getClassName() {
    // < IE9 is not support `Object.getPrototypeOf`
    return Object.getPrototypeOf(this).constructor.name;
  }

}
