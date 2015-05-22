'use strict';

import Intent from '../classes/Intent';

export default class ItemsIntent extends Intent {

  intentWillReceiveObservables(observables) {

    this.subscribe(observables.newItem$, (product) => {
      this.domain.addItem(product);
    });

    this.subscribe(observables.newItems$, (products) => {
      this.domain.newItems(products);
    });

  }
}
