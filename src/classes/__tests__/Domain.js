'use strict';

import * as assert from 'power-assert';
import * as sinon  from 'sinon';
import * as React  from 'react/addons';
import * as Kefir  from 'kefir';

import Action  from '../Action';
import Domain  from '../Domain';
import Store   from '../Store';
import Subject, { KefirBuilder } from '../Subject';

Subject.setBuilder(new KefirBuilder(Kefir));

let TestUtils = React.addons.TestUtils;

describe('Domain', ()=> {

  class TestDomain extends Domain {
  }

  class TestAction extends Action {
  }

  class TestStore extends Store {
  }

  class TestComponent extends React.Component {
    render() {
      return <div className="hogehoge" />;
    }
  }

  it('`.registerAction()` & `.getAction()` & throw error, when invalid args', () => {
    let domain = new TestDomain();
    let action = new TestAction();
    domain.registerAction(action);
    assert(domain.getAction(TestAction) === action);

    // is not Action
    assert.throws(() => {
      domain.registerAction(new TestStore());
    }, Error);

    // is not registered
    assert.throws(() => {
      domain.getAction(Action);
    }, Error);
  });

  it('`.registerStore()` & `.getStore()` & throw error, when invalid args', () => {
    let domain = new TestDomain();
    let store = new TestStore();
    domain.registerStore(store);
    assert(domain.getStore(TestStore) === store);

    // is not Store
    assert.throws(() => {
      domain.registerStore(new TestStore());
    }, Error);

    // is not registered
    assert.throws(() => {
      domain.getStore(new Store());
    }, Error);
  });

  it('`.subscribeActionObservableFromStore()`', () => {
    let domain = new TestDomain();
    let store  = new TestStore();
    let action = new TestAction();
    domain.registerStore(store);
    domain.registerAction(action);
    domain.subscribeActionObservableFromStore();

    let spy = sinon.spy();
    let arg = {foo : 'bar'};
    store.subscribeEvent('test', spy);
    action.publish('test', arg);
    assert(spy.withArgs(arg).calledOnce);
  });

  it('`.mountRootComponent()`', () => {
    let domain = new TestDomain();
    let container = document.createElement('div');
    let component = domain.mountRootComponent(TestComponent, container);

    assert(component.props.domain === domain);
    assert(TestUtils.findRenderedDOMComponentWithClass(component, 'hogehoge'));

    React.unmountComponentAtNode(container);
  });

});
