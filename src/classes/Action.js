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
   * @param {string} eventName
   * @param {*} payload
   */
  publish(eventName, payload) {
    this.eventStream$.next({
      event   : eventName,
      payload : payload
    });
  }

  /**
   * alias of `publish()`
   * @param {string} eventName
   * @param {*} payload
   */
  do(eventName, payload) {
    return this.publish(eventName, payload);
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
