'use strict';

import utils from '../utils';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * @class Store
 */
export default class Store {

  /**
   * @type {Object<string, function>} dispatchReceiver
   */
  dispatchReceiver = {};

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }
}
