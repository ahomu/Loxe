'use strict';

import utils from '../utils';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
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
   *
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
   * @param {Component} component
   */
  onReceiveComponentWillUnmount(component) {
    let intents = this._intents.get(component);
    intents.forEach((intent) => intent.dispose());
  }

  /**
   * TODO implements `waitFor`
   *
   * @param {string} type
   * @param {Object} payload
   */
  dispatch(type, payload) {
    this._stores.forEach((store) => {
      let receiver = store.dispatchReceiver[type];

      if (receiver) {
        receiver.bind(store)(payload);
      }
    });
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
