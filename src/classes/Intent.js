'use strict';

import utils from '../utils';
import {PropTypes} from 'react';

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
    if (observable$ == null) {
      return;
    }
    this._subscriptions.push(observable$.onValue(observer));
  }

  /**
   *
   */
  unsubscribeAll() {
    this._subscriptions.forEach((subscription) => subscription());
    this._subscriptions = [];
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
   * Get Function.name
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
   *
   * @returns {string}
   */
  getClassName() {
    if (!this.constructor.name) {
      this.constructor.name = utils.extractNameFromFunction(this.constructor);
    }

    return this.constructor.name;
  }
}
