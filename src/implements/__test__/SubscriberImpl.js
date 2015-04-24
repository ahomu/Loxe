'use strict';

import assert from 'power-assert';
import React from 'react/dist/react-with-addons';
import SubscriberImpl from '../SubscriberImpl';
import Bus from '../../classes/Bus';
import sinon from 'sinon';

describe('SubscriberImpl', ()=> {

  class Test {
    _subscriptions = [];

    subscribe(observable$, observer) {
      SubscriberImpl.subscribe.apply(this, [observable$, observer]);
    }

    unsubscribeAll() {
      SubscriberImpl.unsubscribeAll.apply(this);
    }
  }

  it('can subscribe Observable/Bus/EventStream/Property', ()=> {

    let test = new Test();
    let bus1 = Bus.create();
    let bus2 = Bus.create();
    let spy = sinon.spy();

    test.subscribe(bus1, spy);

    test.subscribe(bus2, spy);

    bus1.emit(true);
    bus2.emit(true);
    assert(spy.calledTwice);

    bus1.emit(true);
    assert(spy.calledThrice);
  });

  it('can unsubscribeAll Observable/Bus/EventStream/Property', ()=> {

    let test = new Test();
    let bus1 = Bus.create();
    let bus2 = Bus.create();
    let bus3 = Bus.create();
    let spy = sinon.spy();

    test.subscribe(bus1, spy);
    test.subscribe(bus2, spy);
    test.subscribe(bus3, spy);

    bus1.emit(true);
    bus2.emit(true);
    bus3.emit(true);
    assert(spy.calledThrice);

    test.unsubscribeAll();

    bus1.emit(true);
    bus2.emit(true);
    bus3.emit(true);
    assert(spy.calledThrice);
  });

});
