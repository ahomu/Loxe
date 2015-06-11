'use strict';

import * as assert from 'power-assert';
import * as React  from 'react/addons';

import Store  from '../../classes/Store';
import Domain  from '../../classes/Domain';
import Subject  from '../../classes/Subject';

import provideObservables from '../provideObservables';
import provideContext from '../provideContext';

let TestUtils = React.addons.TestUtils;

describe('@provideObservables', ()=> {

  class TestDomain extends Domain {
    getObservables() {
      return {
        export$ : this.getStore(TestStore).test$
      };
    }
  }
  class TestStore extends Store {
    test$ = Subject.property(666);
  }

  @provideObservables(React, observables => ({
    export : observables.export$
  }))
  class ChildComponent extends React.Component {
    render() {
      return <div />;
    }
  }

  @provideContext(React)
  class RootComponent extends React.Component {
    render() {
      return <ChildComponent />;
    }
  }

  it('@provideObservables', () => {
    let domain = new TestDomain();
    let store = new TestStore();
    let container = document.createElement('div');

    domain.registerStore(store);
    let root = domain.mountRootComponent(React, RootComponent, container);
    let innerWrapped = TestUtils.findRenderedComponentWithType(root, ChildComponent._originalComponent);

    assert(innerWrapped.props.export === 666);
    store.test$.push(13);
    assert(innerWrapped.props.export === 13);

    React.unmountComponentAtNode(container);
  });

});
