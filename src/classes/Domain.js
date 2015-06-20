'use strict';

import * as React  from 'react';

import ReflectionImpl from '../implements/ReflectionImpl';
import Action from './Action';
import Store from './Store';

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
   * @param {Action} action
   */
  registerAction(action) {
    if (!(action instanceof Action)) {
      throw new Error(`Given instance of ${action.getClassName()} is not Action`);
    }

    let ActionClass = Object.getPrototypeOf(action).constructor;
    if (this.actions.has(ActionClass)) {
      throw new Error(`${action.getClassName()} already exists in this domain.`);
    } else {
      this.actions.set(ActionClass, action);
    }
  }

  /**
   * @param {Function} ActionClass
   * @returns {Action}
   */
  getAction(ActionClass) {
    if (!this.actions.has(ActionClass)) {
      throw new Error(`${ActionClass.constructor.name} is not registered as Action.`);
    }

    return this.actions.get(ActionClass);
  }

  /**
   * @param {Store} store
   */
  registerStore(store) {
    if (!(store instanceof Store)) {
      throw new Error(`Given instance of ${store.getClassName()} is not Store`);
    }

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
    if (!this.stores.has(StoreClass)) {
      throw new Error(`${StoreClass.constructor.name} is not registered as Store.`);
    }

    return this.stores.get(StoreClass);
  }

  /**
   * All `Store` subscribe to all `Action`'s Observable
   */
  subscribeActionObservableFromStore() {
    for (let store of this.stores.values()) {
      for (let action of this.actions.values()) {
        store.plugAction(action);
      }
    }
  }

  /**
   * @param {Component} Component
   * @param {Element} mountNode
   * @returns {ReactComponent}
   */
  mountRootComponent(Component, mountNode) {
    this.subscribeActionObservableFromStore();
    return React.render(React.createElement(Component, {domain : this}), mountNode);
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
