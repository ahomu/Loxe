'use strict';

import Bus from '../classes/Bus';
import Store from '../classes/Store';
import {KEYS} from './ItemsDomain';

export default class ItemsStore extends Store {

  /**
   * @type {Array<Object>}
   * @private
   */
  _items = [];

  /**
   * @type {Bacon.Property} outputProperty
   */
  items$ = Bus.create();

  /**
   * @param {string} eventType
   * @param {Object} payload
   */
  storeReceiveDispatch(eventType, payload) {
    switch (eventType) {
      case KEYS.ADD_NEW_ITEM:
        this.addItem(payload.item);
        this.items$.emit(this._items);
        break;
      case KEYS.INIT_NEW_ITEMS:
        payload.items.forEach(this.addItem.bind(this));
        this.items$.emit(this._items);
        break;
      default:
        console.warn(`Unexpected events received '${eventType}'`);
    }
  };

  /**
   * @param {Object} item
   */
  addItem(item) {
    this._items.unshift(item);
  }

}
