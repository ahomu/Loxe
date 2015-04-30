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
   * @private
   * @type {Array<Store>}
   */
  _stores = [];

  /**
   * @private
   * @type {WeakMap<Intent>}
   */
  _intents = new WeakMap();

  /**
   * export observable interface
   *
   * @type {Object<string, Observable>}
   */
  observables = {};

  /**
   * @type {Array<Intent>}
   */
  intents = [];

  /**
   * `prepare` method not implemented anything initially.
   * Define the `observables` to expose within the prepare method.
   *
   * ```
   * prepare() {
   *   this.observables = {
   *     [DomainEvents.allProducts$]  : this.getStore('ProductStore').products$.toProperty(),
   *     [DomainEvents.cartProducts$] : this.getStore('CartStore').products$.toProperty(),
   *     [DomainEvents.cartTotal$]    : this.getStore('CartStore').total$.toProperty()
   *   };
   * }
   * ```
   */
  prepare() {
    // implements required
  }

  /**
   * @param {Store} store
   */
  addStore(store) {
    if (this._stores.indexOf(store) !== -1) {
      console.warn('Given store already registered.', store);
      return this;
    }
    this._stores.push(store);
  }

  /**
   * @param {string} storeName
   */
  getStore(storeName) {
    return this._stores.filter((store) => store.getClassName() === storeName)[0];
  }

  /**
   * Create the Intent to respond when an mount component.
   *
   * @param {Component} component
   */
  onReceiveComponentDidMount(component) {
    let intents = this.intents.map((Intent) => {
      let intent = new Intent();

      intent.setDomain(this);
      intent.intentWillReceiveObservables(component.observables);
      return intent;
    });

    this._intents.set(component, intents);
  }

  /**
   * Destroy the Intent to respond when an Unmount component.
   *
   * @param {Component} component
   */
  onReceiveComponentWillUnmount(component) {
    let intents = this._intents.get(component);
    intents.forEach((intent) => intent.dispose());
  }

  /**
   * Dispatch ActionType and payload data to stores.
   *
   * TODO implements `waitFor`
   *
   * @param {string} type
   * @param {Object} payload
   */
  dispatch(type, payload) {
    this._stores.forEach((store) => {
      store.storeReceiveDispatch(type, payload);
    });
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
