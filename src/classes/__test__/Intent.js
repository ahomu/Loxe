'use strict';

import assert from 'power-assert';
import React from 'react/dist/react-with-addons';
import Intent from '../Intent';
import Domain from '../Domain';
import Component from '../Component';
import Bus from '../Bus';
import sinon from 'sinon';

describe('Intent', ()=> {

  it('can subscribe & unsubscribeAll', ()=> {
    let intent = new Intent();
    let bus = Bus.create();
    let spy = sinon.spy();

    intent.subscribe(bus, spy);
    assert(!spy.called);

    bus.emit(true);
    assert(spy.withArgs(true).calledOnce);

    intent.unsubscribeAll();
    bus.emit(true);
    assert(spy.withArgs(true).calledOnce);
  });

  it('domain -> component -> intent complexity test', () => {
    let observerSpy = sinon.spy();
    let container = document.createElement('div');

    class TestDomain extends Domain {
      intents = [TestIntent]
    }
    class TestIntent extends Intent {
      intentWillReceiveObservables(observables) {
        this.subscribe(observables.test$, observerSpy);
      }
    }
    class TestComponent extends Component {
      observables = {
        test$ : Bus.create()
      }
    }

    let testDomain = new TestDomain();
    let onReceiveComponentDidMountSpy = sinon.spy(testDomain, 'onReceiveComponentDidMount');
    let onReceiveComponentWillUnmountSpy = sinon.spy(testDomain, 'onReceiveComponentWillUnmount');

    // mount component, maybe called `Domain#onReceiveComponentDidMount()` -> `Intent#intentWillReceiveObservables()`
    let testComponent = React.render(<TestComponent domain={testDomain} />, container);
    let testIntent = testDomain._intents.get(testComponent)[0]; // FIXME
    assert(onReceiveComponentDidMountSpy.calledOnce);
    assert(!observerSpy.called);
    assert(testIntent.domain === testDomain);

    // emit from component observable
    let arg = {foo : 'bar'};
    testComponent.observables.test$.emit(arg);
    assert(observerSpy.withArgs(arg).calledOnce);

    // unmount component, maybe called `Domain#onReceiveComponentDidUnmount()` -> `Intent#dispose`
    React.unmountComponentAtNode(container);
    testComponent.observables.test$.emit(arg);
    assert(onReceiveComponentWillUnmountSpy.calledOnce);
    assert(observerSpy.calledOnce);
    assert(testIntent.domain == null);

  });
});
