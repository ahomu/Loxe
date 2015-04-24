'use strict';

import assert from 'power-assert';
import React from 'react/dist/react-with-addons';
import Domain from '../Domain';
import Component from '../Component';
import Store from '../Store';
import sinon from 'sinon';

let TestUtils = React.addons.TestUtils;

describe('Domain', ()=> {

  const DISPATCH_TEST1 = 'DISPATCH_TEST1';
  const DISPATCH_TEST2 = 'DISPATCH_TEST2';

  it('can add & get store', ()=> {
    let domain = new Domain();
    let store = new Store();
    domain.addStore(store);

    assert(domain.getStore('Store') === store);
  });

  it('can dispatch to stores', ()=> {
    let arg = {foo : 'bar'};
    let domain = new Domain();
    let store1 = new Store();
    let store2 = new Store();
    let spy1 = sinon.spy();
    let spy2 = sinon.spy();

    domain.addStore(store1);
    domain.addStore(store2);
    store1.dispatchReceiver[DISPATCH_TEST1] = spy1;
    store2.dispatchReceiver[DISPATCH_TEST2] = spy2;

    domain.dispatch(DISPATCH_TEST1, arg);
    assert(spy1.withArgs(arg).calledOnce);
    assert(!spy2.called);

    domain.dispatch(DISPATCH_TEST2, arg);
    assert(spy1.withArgs(arg).calledOnce);
    assert(spy2.withArgs(arg).calledOnce);
  });

  it('called onReceiveComponentDidMount() correctly', ()=> {
    let domain = new Domain();
    let spy = sinon.spy(domain, 'onReceiveComponentDidMount');

    assert(!spy.called);
    TestUtils.renderIntoDocument(<Component domain={domain} />);
    assert(spy.calledOnce);
  });

  it('called onReceiveComponentWillUnmount() correctly', ()=> {
    let domain = new Domain();
    let spy = sinon.spy(domain, 'onReceiveComponentWillUnmount');
    let container = document.createElement('div');

    React.render(<Component domain={domain} />, container);
    assert(!spy.called);

    React.unmountComponentAtNode(container);
    assert(spy.calledOnce);
  });

});
