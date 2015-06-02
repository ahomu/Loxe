'use strict';

import Rx from 'rx-lite';

/**
 * @class Bus
 */
export default {
  /**
   * Bus for `Intent`
   * @returns {Rx.Subject}
   */
  intent() {
    return this.create(Rx.Subject);
  },

  /**
   * Bus for `Component` ui events
   * @returns {Rx.Subject}
   */
  event() {
    return this.create(Rx.Subject);
  },

  /**
   * Bus for `Store`
   *
   * @param {*} initialValue
   * @returns {Rx.Subject}
   */
  store(initialValue) {
    return this.create(Rx.BehaviorSubject, initialValue);
  },

  /**
   * @param {Rx.Subject|Rx.BehaviorSubject} BaseSubject
   * @param {*} [initialValue]
   * @returns {Rx.Subject}
   */
  create(BaseSubject, initialValue) {
    function BusSubject() {
      BusSubject.onNext.apply(BusSubject, arguments);
    }

    for (let key in BaseSubject.prototype) {
      // Function#name is readonly...
      if (key !== 'name') {
        BusSubject[key] = BaseSubject.prototype[key];
      }
    }

    // Emit a unified interface.
    BusSubject.emit = function() {
      BusSubject.onNext.apply(BusSubject, arguments);
    };

    // construct `Rx.Subject` as handelBus
    BaseSubject.call(BusSubject, initialValue);

    return BusSubject;
  }
};
