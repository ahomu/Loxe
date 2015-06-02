'use strict';

import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * @class Store
 */
export default class Store {

  /**
   * @constructor
   */
  constructor() {
    this.onSubscribeIntents();
  }

  /**
   *
   */
  onSubscribeIntents() {
    // implements required
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }
}
