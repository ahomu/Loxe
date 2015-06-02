'use strict';

import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * Domain contains one or more Store and manage application acts within the business domain.
 * Has the role of Action and Dispatcher in flux, the dispatch message store.
 * `this.observables` which bundled the output from more than one Store to provide for the Component.
 *
 * Do not control state in the domain, asynchronous processing also does not.
 * State that all keep in the Store.
 * Asynchronous processing should be implemented as the DomainUtils.
 *
 * The mount/unmuont component in conjunction with Intent for creation / deletion.
 *
 * @class Domain
 */
export default class Domain {

  /**
   * export observable interface
   *
   * @type {Object<string, Observable>}
   */
  observables = {};

  /**
   * @constructor
   */
  constructor() {
    this.observables = this.onCreateObservables();
  }

  /**
   * `onCreateObservables` method not implemented anything initially.
   * Define the `observables` to expose within the prepare method.
   *
   * ```
   * onCreateObservables() {
   *   return {
   *     [DomainEvents.allProducts$]  : this.getStore('ProductStore').products$.toProperty(),
   *     [DomainEvents.cartProducts$] : this.getStore('CartStore').products$.toProperty(),
   *     [DomainEvents.cartTotal$]    : this.getStore('CartStore').total$.toProperty()
   *   };
   * }
   * ```
   *
   * @returns {Object<string, Rx.Observable>}
   */
  onCreateObservables() {
    // implements required
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
