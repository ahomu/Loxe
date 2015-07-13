'use strict';

import Action from '../src/classes/Action';

export default class AppAction extends Action {

  initItems() {
    this.do('INIT_ITEMS', [
      {text : '文字数カウント', time : Date.now() - 60 * 60 * 9 * 1000},
      {text : '文字数制限', time : Date.now() - 60 * 60 * 6 * 1000},
      {text : 'Shift+Enterでも投稿', time : Date.now() - 60 * 60 * 3 * 1000},
      {text : '投稿したらリストに反映', time : Date.now()}
    ].reverse());
  }

  addItem(item) {
    this.do('ADD_ITEM', item);
  }
}
