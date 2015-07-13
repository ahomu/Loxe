'use strict';

import Domain   from '../src/classes/Domain';
import AppStore from './AppStore';

export default class AppDomain extends Domain {

  getObservables() {
    return {
      items$ : this.getStore(AppStore).items$
    };
  }
}
