'use strict';

import Bus from '../classes/Bus';
import Intent from '../classes/Intent';

export class AppIntent extends Intent {

  /**
   * @type {Rx.Subject<Item>}
   */
  newItem$ = Bus.intent();

  /**
   * @type {Rx.Subject<Array<Item>>}
   */
  newItems$ = Bus.intent();

}

export default new AppIntent();
