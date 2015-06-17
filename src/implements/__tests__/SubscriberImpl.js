'use strict';

import * as assert from 'power-assert';
import * as sinon  from 'sinon';
import * as Kefir  from 'kefir';

import SubscriberImpl from '../SubscriberImpl';
import Subject, { KefirSubjectBuilder } from '../../classes/Subject';

Subject.setBuilder(new KefirSubjectBuilder(Kefir));

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

    bus1.push(true);
    bus2.push(true);
    assert(spy.calledTwice);

    bus1.push(true);
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

    bus1.push(true);
    bus2.push(true);
    bus3.push(true);
    assert(spy.calledThrice);

    test.unsubscribeAll();

    bus1.push(true);
    bus2.push(true);
    bus3.push(true);
    assert(spy.calledThrice);
  });

});
