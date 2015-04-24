'use strict';

import Bacon from 'baconjs';

export default {
  /**
   * @returns {Bacon.Bus}
   */
  create() {
    function handleBus() {
      handleBus.push.apply(handleBus, arguments);
    }

    for (let key in Bacon.Bus.prototype) {
      // Function#name is readonly...
      if (key !== 'name') {
        handleBus[key] = Bacon.Bus.prototype[key];
      }
    }

    if (handleBus.push && !handleBus.emit) {
      handleBus.emit = function() {
        handleBus.push.apply(handleBus, arguments);
      };
    }

    // construct `Bacon.Bus` as handelBus
    Bacon.Bus.call(handleBus);

    return handleBus;
  },

  /**
   * @param {...Observable} observables
   */
  merge(...observables) {
    return Bacon.mergeAll(...observables);
  }
};
