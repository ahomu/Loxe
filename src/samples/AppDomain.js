'use strict';

import Domain   from '../classes/Domain';
import AppStore from './AppStore';

export class ItemsDomain extends Domain {

  onCreateObservables() {
    return {
      update$ : AppStore.items$
    };
  }
}

export default new ItemsDomain();
