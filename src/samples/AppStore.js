'use strict';

import Bus from '../classes/Bus';
import Store from '../classes/Store';
import AppIntent from './AppIntent';

export class AppStore extends Store {

  /**
   * @type {Array<Object>}
   * @private
   */
  _items = [];

  /**
   * @type {Bacon.Property} outputProperty
   */
  items$ = Bus.store([]);

  /**
   *
   */
  onSubscribeIntents() {
    AppIntent.newItem$.subscribe((item) => {
      this.addItem(item);
      this.items$.emit(this._items);
    });

    AppIntent.newItems$.subscribe((items) => {
      items.forEach(this.addItem.bind(this));
      this.items$.emit(this._items);
    });
  }

  /**
   * @param {Object} item
   */
  addItem(item) {
    this._items.unshift(item);
  }

}

export default new AppStore();
