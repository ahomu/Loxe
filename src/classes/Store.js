'use strict';

import ReflectionImpl from '../implements/ReflectionImpl';
import SubscriberImpl from '../implements/SubscriberImpl';

/**
 * @class Store
 */
export default class Store {

  /**
   * Delegate to `SubscriberImpl.subscribe()`
   *
   * @param {Rx.Observable<ActionData>} observable$
   * @param {string} filterKey
   * @param {function} observer
   */
  subscribe(observable$, filterKey, observer) {
    SubscriberImpl.subscribe.apply(this, [
      observable$
        .filter(({key}) => key === filterKey)
        .map(({value}) => value),
      observer
    ]);
  }

  /**
   *
   * @param observable$
   * @param definitions
   */
  subscribeAll(observable$, definitions) {
    Object.keys(definitions).forEach((key) => {
      this.subscribe(observable$, key, definitions[key]);
    });
  }

  /**
   * Delegate to `SubscriberImpl.unsubscribeAll()`
   */
  unsubscribeAll() {
    SubscriberImpl.unsubscribeAll.apply(this);
  }

  /**
   *
   */
  onReceiveObservable() {
    throw new Error('`onReceiveObservable` is abstract method. You should implements in sub-class');
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
