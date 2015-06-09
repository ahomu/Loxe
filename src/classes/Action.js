'use strict';

import Subject from './Subject';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * @typedef {Object} ActionData
 * @property {string} key
 * @property {*} value
 */

/**
 * The role of this class is the Flux `Action`.
 * Implements the behavior methods subclasses that inherit from it.
 * `publish` method is executed, and data flows from the `Observable` to `Store`.
 *
 * @class Action
 */
export default class Action {

  /**
   * @type {Kefir.Stream<ActionData>}
   * @private
   */
  eventStream$ = Subject.stream();

  /**
   * @param {string} key
   * @param {*} value
   */
  publish(key, value) {
    this.eventStream$.push({
      key   : key,
      value : value
    });
  }

  /**
   * alias of `publish()`
   * @param {string} key
   * @param {*} value
   */
  do(key, value) {
    return this.publish(key, value);
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
