'use strict';

import * as assert from 'power-assert';
import * as sinon  from 'sinon';
import * as Kefir  from 'kefir';

import SubscriberImpl from '../SubscriberImpl';
import Subject, { KefirBuilder } from '../../classes/Subject';

Subject.setBuilder(new KefirBuilder(Kefir));

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

  it('can subscribe Observable/Subject/EventStream/Property', ()=> {

    let test = new Test();
    let bus1 = Subject.stream();
    let bus2 = Subject.stream();
    let spy = sinon.spy();

    test.subscribe(bus1, spy);

    test.subscribe(bus2, spy);

    bus1.next(true);
    bus2.next(true);
    assert(spy.calledTwice);

    bus1.next(true);
    assert(spy.calledThrice);
  });

  it('can unsubscribeAll Observable/Subject/EventStream/Property', ()=> {

    let test = new Test();
    let bus1 = Subject.stream();
    let bus2 = Subject.stream();
    let bus3 = Subject.stream();
    let spy = sinon.spy();

    test.subscribe(bus1, spy);
    test.subscribe(bus2, spy);
    test.subscribe(bus3, spy);

    bus1.next(true);
    bus2.next(true);
    bus3.next(true);
    assert(spy.calledThrice);

    test.unsubscribeAll();

    bus1.next(true);
    bus2.next(true);
    bus3.next(true);
    assert(spy.calledThrice);
  });

});
