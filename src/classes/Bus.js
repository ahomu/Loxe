'use strict';

import Rx from 'rx-lite';

const BaseSubject = Rx.Subject;

/**
 * @class Bus
 */
export default {
  /**
   * @param {*} initialValue
   * @returns {Rx.Subject}
   */
  create(initialValue) {
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
