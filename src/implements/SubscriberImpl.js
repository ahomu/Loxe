'use strict';

/**
 * @class SubscriberImpl
 */
export default class SubscriberImpl {

  /**
   * @type {Array<Subscription>}
   */
  _subscriptions = [];

  /**
   * @param {Observable} observable$
   * @param {function} observer
   */
  static subscribe(observable$, observer) {
    if (observable$ == null) {
      return;
    }
    this._subscriptions.push(observable$.onValue(observer));
  }

  /**
   *
   */
  static unsubscribeAll() {
    this._subscriptions.forEach((subscription) => subscription());
    this._subscriptions = [];
  }

}