'use strict';

import * as assert from 'power-assert';
import * as React  from 'react/addons';

import Store  from '../../classes/Store';
import Domain  from '../../classes/Domain';
import Subject, { KefirSubjectBuilder } from '../../classes/Subject';

import provideObservables from '../provideObservables';
import provideContext from '../provideContext';

import * as Kefir from 'kefir';
import * as kefirCombineTemplate from 'kefir.combinetemplate';

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

  @provideObservables(observables => ({
    export : observables.export$
  }))
  class ChildComponent extends React.Component {
    render() {
      return <div />;
    }
  }

  @provideContext()
  class RootComponent extends React.Component {
    render() {
      return <ChildComponent />;
    }
  }

  it('@provideObservables', () => {
    Subject.setBuilder(new KefirSubjectBuilder(Kefir));
    Subject.setCombineTemplate(kefirCombineTemplate);

    let domain = new TestDomain();
    let store = new TestStore();
    let container = document.createElement('div');

    domain.registerStore(store);
    let root = domain.mountRootComponent(RootComponent, container);
    let innerWrapped = TestUtils.findRenderedComponentWithType(root, ChildComponent._originalComponent);

    assert(innerWrapped.props.export === 666);
    store.test$.push(13);
    assert(innerWrapped.props.export === 13);

    React.unmountComponentAtNode(container);
  });

});
