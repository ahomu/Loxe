'use strict';

import Rx from 'rx-lite';

/**
 * @class Bus
 */
export default {
  /**
   * @returns {Rx.Subject}
   */
  create() {
    function BusSubject() {
      BusSubject.onNext.apply(BusSubject, arguments);
    }

    for (let key in Rx.Subject.prototype) {
      // Function#name is readonly...
      if (key !== 'name') {
        BusSubject[key] = Rx.Subject.prototype[key];
      }
    }

    // Emit a unified interface.
    BusSubject.emit = function() {
      BusSubject.onNext.apply(BusSubject, arguments);
    };

    // construct `Rx.Subject` as handelBus
    Rx.Subject.call(BusSubject);

    return BusSubject;
  }
};
