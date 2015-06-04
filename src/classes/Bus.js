'use strict';

import * as Rx from 'rx-lite';

/**
 * @class Bus
 */
export default class Bus {
  /**
   * Bus for `Component` ui events & `Action` publish events
   *
   * @returns {Rx.Subject}
   */
  static event() {
    return Bus.create(Rx.Subject);
  }

  /**
   * Bus for `Store` data property
   *
   * @param {*} initialValue
   * @returns {Rx.Subject}
   */
  static property(initialValue) {
    return Bus.create(Rx.BehaviorSubject, initialValue);
  }

  /**
   * @param {Rx.Subject|Rx.BehaviorSubject} BaseSubject
   * @param {*} [initialValue]
   * @returns {Rx.Subject}
   */
  static create(BaseSubject, initialValue) {
    function BusSubject() {
      BusSubject.onNext.apply(BusSubject, arguments);
    }

    for (let key in BaseSubject.prototype) {
      // Function#name is readonly...
      if (key !== 'name') {
        BusSubject[key] = BaseSubject.prototype[key];
      }
    }

    // `push` alias of `onNext`
    BusSubject.push = function() {
      BusSubject.onNext.apply(BusSubject, arguments);
    };

    // construct `Rx.Subject` as handelBus
    BaseSubject.call(BusSubject, initialValue);

    return BusSubject;
  }
}
