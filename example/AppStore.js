'use strict';

import Subject from '../src/classes/Subject';
import Store from '../src/classes/Store';

export default class AppStore extends Store {

  /**
   * @type {Array<Object>}
   * @private
   */
  _items = [];

  /**
   * @type {Bacon.Property} outputProperty
   */
  items$ = Subject.property(this._items);

  /**
   *
   */
  constructor() {
    super();

    this.subscribe('INIT_ITEMS', (items => {
      items.forEach(this.addItem.bind(this));
      this.items$.next(this._items);
    }));

    this.subscribe('ADD_ITEM', (item => {
      this.addItem(item);
      this.items$.next(this._items);
    }));
  }

  /**
   * @param {Object} item
   */
  addItem(item) {
    this._items.unshift(item);
  }

}
