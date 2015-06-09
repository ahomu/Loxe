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
 *   constructor() {
 *     super();
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
   *
   * @param {Rx.Observable<ActionData>} eventStream$
   */
  plugActionEventStream(eventStream$) {
    this.subscribe(eventStream$, this.plugStream$.push.bind(this.plugStream$));
  }

  /**
   *
   * @param {string} filterKey
   * @returns {Rx.Observable<*>}
   */
  getEvent(filterKey) {
    return this.plugStream$
      .filter(({key}) => key === filterKey)
      .map(({value}) => value);
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
