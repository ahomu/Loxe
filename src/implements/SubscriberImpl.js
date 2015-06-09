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

    let subscription;
    if (observable$.subscribe) {
      // Rx
      subscription = observable$.subscribe(observer);
    } else {
      // Bacon, Kefir
      observable$.onValue(observer)
      subscription = [observable$, observer];
    }

    this._subscriptions = this._subscriptions || [];
    this._subscriptions.push(subscription);
  }

  /**
   * To discard all subscriptions of the observable.
   */
  static unsubscribeAll() {
    this._subscriptions = this._subscriptions || [];

    this._subscriptions.forEach((subscription) => {
      if (subscription.dispose) {
        // Rx
        subscription.dispose();
      } else {
        // Bacon, Kefir
        subscription[0].offValue(subscription[1]);
      }
    });
    this._subscriptions = [];
  }

}