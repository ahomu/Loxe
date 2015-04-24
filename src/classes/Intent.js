'use strict';

import {PropTypes} from 'react';
import SubscriberImpl from '../implements/SubscriberImpl';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * Intent to convert event data received from the Component, call the Action method of the Domain.
 * Only Intent is familiar with both data from Component and the Domain interface.
 *
 * @class Intent
 */
export default class Intent {

  /**
   * @type {Domain}
   */
  domain = null;

  /**
   * @type {Array<Subscription>}
   */
  _subscriptions = [];

  /**
   * Delegate to `SubscriberImpl.subscribe()`
   *
   * @param {Observable} observable$
   * @param {function} observer
   */
  subscribe(observable$, observer) {
    SubscriberImpl.subscribe.apply(this, [observable$, observer]);
  }

  /**
   * Delegate to `SubscriberImpl.unsubscribeAll()`
   */
  unsubscribeAll() {
    SubscriberImpl.unsubscribeAll.apply(this, arguments);
  }

  /**
   * @param {Domain} domain
   */
  setDomain(domain) {
    this.domain = domain;
  }

  /**
   * When the intent itself is destroyed.
   */
  dispose() {
    this.unsubscribeAll();
    this.domain = null;
  }

  /**
   * Implement this method in a subclass, you handle the Observables.
   *
   * ```
   * intentWillReceiveObservables(observables) {
   *   this.subscribe(observables[ComponentEvents.newItem$], (product) => {
   *     this.domain.addToCart(product);
   *   });
   *   this.subscribe(observables[ComponentEvents.checkout$], (products) => {
   *     this.domain.cartCheckout(products);
   *   })
   * }
   * ```
   *
   * @param {Object<string, Observables>} observables
   */
  intentWillReceiveObservables() {
    // implement...
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }
}
