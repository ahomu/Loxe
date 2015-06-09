'use strict';

import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * Do not control application data in the domain, asynchronous processing also does not.
 * Application data that all keep in the Store.
 * Asynchronous processing should be implemented as external function.
 *
 * @class Domain
 */
export default class Domain {

  /**
   * @type {Map<Function, Store>}
   */
  stores = new Map();

  /**
   * @type {Map<Function, Action>}
   */
  actions = new Map();

  /**
   * @param {Action} intent
   */
  registerAction(intent) {
    let ActionClass = Object.getPrototypeOf(intent).constructor;
    if (this.actions.has(ActionClass)) {
      throw new Error(`${intent.getClassName()} already exists in this domain.`);
    } else {
      this.actions.set(ActionClass, intent);
    }
  }

  /**
   * @param {Function} ActionClass
   * @returns {Action}
   */
  getAction(ActionClass) {
    return this.actions.get(ActionClass);
  }

  /**
   * @param {Store} store
   */
  registerStore(store) {
    let StoreClass = Object.getPrototypeOf(store).constructor;
    if (this.stores.has(StoreClass)) {
      throw new Error(`${store.getClassName()} already exists in this domain.`);
    } else {
      this.stores.set(StoreClass, store);
    }
  }

  /**
   * @param {Function} StoreClass
   * @returns {Store}
   */
  getStore(StoreClass) {
    return this.stores.get(StoreClass);
  }

  /**
   * All `Store` subscribe to all `Action`'s Observable
   */
  subscribeActionObservableFromStore() {
    for (let store of this.stores.values()) {
      for (let action of this.actions.values()) {
        store.plugActionEventStream(action.eventStream$);
      }
    }
  }

  /**
   * @returns {{domain: Domain}}
   */
  getRootProps() {
    this.subscribeActionObservableFromStore();
    return {domain : this};
  }

  /**
   * `getObservables` method not implemented anything initially.
   * This method will call from the `provideObservables`.
   * Sync the prop component the returned object as a template.
   * Good for most `observables` caching as a property value.
   *
   * @example
   * ```
   * observables = null;
   *
   * getObservables() {
   *   if (!this.observables) {
   *   this.observables = {
   *       update$ : this.getStore(AppStore).items$
   *     };
   *   }
   *
   *   return this.observables;
   * }
   * ```
   *
   * @returns {Object<string, Rx.Observable>}
   */
  getObservables() {
    throw new Error(this.getClassName() + ':`getObservables` is abstract method.' +
      'You should implements in sub-class');
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
