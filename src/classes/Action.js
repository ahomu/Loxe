'use strict';

import Bus from './Bus';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * @typedef {Object} ActionData
 * @property {key} key
 * @property {*} value
 */

/**
 * Intent to convert event data received from the Component, call the Action method of the Domain.
 * Only Intent is familiar with both data from Component and the Domain interface.
 *
 * @class Action
 */
export default class Action {
  /**
   *
   * @type {Rx.Subject<ActionData>}
   */
  _observable$ = Bus.event();

  /**
   *
   * @param {string} key
   * @param {*} value
   */
  publish(key, value) {
    this._observable$.push({
      key   : key,
      value : value
    });
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }
}
