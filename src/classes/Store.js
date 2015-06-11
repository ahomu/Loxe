'use strict';

import Subject from './Subject';
import ReflectionImpl from '../implements/ReflectionImpl';
import SubscriberImpl from '../implements/SubscriberImpl';

/**
 * The role of this class is the Flux `Store`.
 * Subscribe the anonymous Observable provided the Action.
 * Itself has any Observable to expose Domain property.
 *
 * @example
 * ```
 * import {Store, Subject} from 'loxe';
 *
 * export default class AppStore extends Store {
 *   _items = [];
 *   items$ = Subject.property([]);
 *   initialize() {
 *     this.subscribe('ADD_ITEM', (item) => {
 *       this._items.unshift(item);
 *       this.items$.push(this._items);
 *     });
 *   }
 * }
 * ```
 *
 * @class Store
 */
export default class Store {

  /**
   *
   * @type {Kefir.Stream<ActionData>}
   * @private
   */
  plugStream$ = Subject.stream();

  /**
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   *
   */
  initialize() {
    // implements you want
  }

  /**
   *
   * @param {Action} action
   */
  plugAction(action) {
    this.subscribe(action.eventStream$, this.plugStream$.push.bind(this.plugStream$));
  }

  /**
   *
   * @param {string} eventName
   * @returns {Rx.Observable<*>}
   */
  getEvent(eventName) {
    return this.plugStream$
      .filter(({event}) => event === eventName)
      .map(({payload}) => payload);
  }

  /**
   * @param {string} eventName
   * @param {Function} observer
   */
  subscribeEvent(eventName, observer) {
    this.subscribe(this.getEvent(eventName), observer);
  }

  /**
   * Delegate to `SubscriberImpl.subscribe()`
   * Subscribe to if the first argument is a string, it filtered as the event name.
   *
   * @param {string|Rx.Observable<ActionData>} observable$
   * @param {function} observer
   */
  subscribe(observable$, observer) {
    if (typeof observable$ === 'string') {
      observable$ = this.getEvent(observable$);
    }
    SubscriberImpl.subscribe.apply(this, [observable$, observer]);
  }

  /**
   * Delegate to `SubscriberImpl.unsubscribeAll()`
   */
  unsubscribeAll() {
    SubscriberImpl.unsubscribeAll.apply(this);
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
