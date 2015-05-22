'use strict';

import Domain from '../classes/Domain';
import ItemsStore from './ItemsStore';
import ItemsIntent from './ItemsIntent';

export const KEYS = {
  ADD_NEW_ITEM   : 'ALL_NEW_ITEM',
  INIT_NEW_ITEMS : 'INIT_NEW_ITEMS'
};

export default class ItemsDomain extends Domain {

  intents = [ItemsIntent];

  /**
   * @returns {Domain}
   */
  prepare() {
    this.observables = {
      update$ : this.getStore('ItemsStore').items$
    };
  }

  addItem(v) {
    this.dispatch(KEYS.ADD_NEW_ITEM, {
      item : v
    });
  }

  newItems(v) {
    this.dispatch(KEYS.INIT_NEW_ITEMS, {
      items : v
    });
  }

}
