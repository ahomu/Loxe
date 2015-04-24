'use strict';

import utils from '../utils';
import {PropTypes} from 'react';
import SubscriberImpl from '../implements/SubscriberImpl';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
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
   * @param {Observable} observable$
   * @param {function} observer
   */
  subscribe(observable$, observer) {
    SubscriberImpl.subscribe.apply(this, [observable$, observer]);
  }

  /**
   *
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
   *
   */
  dispose() {
    this.unsubscribeAll();
    this.domain = null;
  }

  /**
   * must be implement
   * @param {Object<string, Observables>} observables
   */
  intentWillReceiveObservables() {
    //
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }
}
