'use strict';

import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * @class Store
 */
export default class Store {

  /**
   * Describes the ActionType received from domain, what action to take.
   *
   * ```
   * dispatchReceiver = {
   *   [ActionTypes.RECEIVE_PRODUCTS] : (payload)=> {
   *     this._products = payload.products;
   *     this.products$.emit(this.getAllProducts());
   *   },
   *   [ActionTypes.ADD_TO_CART]      : (payload)=> {
   *     this._decreaseInventory(payload.product);
   *     this.products$.emit(this.getAllProducts());
   *   }
   * };
   * ```
   *
   * @type {Object<string, function>} dispatchReceiver
   */
  dispatchReceiver = {};

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }
}
