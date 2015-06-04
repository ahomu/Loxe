'use strict';

import * as React from 'react';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * Domain contains one or more Store and manage application acts within the business domain.
 * Has the role of Action and Dispatcher in flux, the dispatch message store.
 * `this.observables` which bundled the output from more than one Store to provide for the Component.
 *
 * Do not control application data in the domain, asynchronous processing also does not.
 * Application data that all keep in the Store.
 * Asynchronous processing should be implemented as external function.
 *
 * The mount/unmuont component in conjunction with Intent for creation / deletion.
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
   *
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
   *
   * @param {Function} ActionClass
   * @returns {Action}
   */
  getAction(ActionClass) {
    return this.actions.get(ActionClass);
  }

  /**
   *
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
   *
   * @param {Function} StoreClass
   * @returns {Store}
   */
  getStore(StoreClass) {
    return this.stores.get(StoreClass);
  }

  /**
   *
   */
  subscribeActionObservableFromStore() {
    for (let store of this.stores.values()) {
      for (let intent of this.actions.values()) {
        store.onReceiveObservable(intent._observable$);
      }
    }
  }

  /**
   * @param {Component} Component
   * @param {Element} mountNode
   */
  mountComponent(Component, mountNode) {
    this.subscribeActionObservableFromStore();
    React.render(React.createFactory(Component)({domain : this}), mountNode);
  }

  /**
   * `getObservables` method not implemented anything initially.
   * Define the `observables` to expose within the prepare method.
   * Good for most `observables` caching as a property value.
   *
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
    throw new Error('`getObservables` is abstract method. You should implements in sub-class');
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
