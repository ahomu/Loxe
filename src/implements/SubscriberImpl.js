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
   * Subscribe to observable, that holds the subscription.
   * Become a memory leak if you subscribe using this method,
   * the end of instance lifecycle manually subscription must discard.
   *
   * @param {Observable} observable$
   * @param {function} observer
   */
  static subscribe(observable$, observer) {
    if (observable$ == null) {
      return;
    }
    this._subscriptions.push(observable$.subscribe(observer));
  }

  /**
   * To discard all subscriptions of the observable.
   */
  static unsubscribeAll() {
    this._subscriptions.forEach((subscription) => subscription.dispose());
    this._subscriptions = [];
  }

}