'use strict';

import assert from 'power-assert';
import React from 'react/dist/react-with-addons';
import Component from '../Component';
import Domain from '../Domain';
import Bus from '../Bus';
import sinon from 'sinon';

let TestUtils = React.addons.TestUtils;

describe('Component', ()=> {

  it('domain as context inheriting to child component', () => {
    class Parent extends Component {
      render() {
        return <Child></Child>;
      }
    }
    class Child extends Component {
      render() {
        return <GrandChild></GrandChild>;
      }
    }
    class GrandChild extends Component {
    }

    let domain = new Domain();
    let parent = TestUtils.renderIntoDocument(<Parent domain={domain}></Parent>);
    let child = TestUtils.findRenderedComponentWithType(parent, Child);
    let grand = TestUtils.findRenderedComponentWithType(parent, GrandChild);

    assert(parent.getDomain() === domain);
    assert(child.getDomain() === domain);
    assert(grand.getDomain() === domain);
  });

  it('can publish value through observable', ()=> {
    class Test extends Component {
      observables = {
        test$ : Bus.create()
      }
    }
    let domain = new Domain();
    let spy = sinon.spy();
    let arg = {foo : 'bar'};
    let test = TestUtils.renderIntoDocument(<Test domain={domain} />);
    test.observables.test$.subscribe(spy);
    assert(!spy.called);
    test.publish('test$', arg);
    assert(spy.withArgs(arg).calledOnce);
  });

  it('can subscribe domain observable & unsubscribe all when unmount component', ()=> {
    let spy = sinon.spy();

    class TestDomain extends Domain {
      observables = {
        test$ : Bus.create()
      }
    }
    class Test extends Component {
      componentWillReceiveObservables(observables) {
        this.subscribe(observables.test$, spy);
      }
    }

    let domain = new TestDomain();
    let arg = {foo : 'bar'};
    let container = document.createElement('div');

    // 1. mount
    React.render(<Test domain={domain} />, container);
    assert(!spy.called);

    // 2. emit
    domain.observables.test$.emit(arg);
    assert(spy.withArgs(arg).calledOnce);

    // 3. unmount
    React.unmountComponentAtNode(container);
    domain.observables.test$.emit(arg);
    assert(spy.withArgs(arg).calledOnce);
  });

  it('throw error when receive invalid value as `domain`', ()=> {
    class Test extends Component { }

    assert.throws(() => {
      TestUtils.renderIntoDocument(<Test domain={false} />);
    });
  });
});
