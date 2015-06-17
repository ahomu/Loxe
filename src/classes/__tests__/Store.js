'use strict';

import * as assert from 'power-assert';
import * as sinon  from 'sinon';
import * as Kefir  from 'kefir';

import Action  from '../Action';
import Store   from '../Store';
import Subject, { KefirSubjectBuilder } from '../Subject';

Subject.setBuilder(new KefirSubjectBuilder(Kefir));

describe('Store', ()=> {

  class TestAction extends Action {
  }

  class TestStore extends Store {
  }

  it('call `.initialize()` when construct', () => {
    let spy = sinon.spy(TestStore.prototype, 'initialize');

    new TestStore() && assert(spy.calledOnce);

    spy.restore();
  });

  it('`.plugAction()` plug Action events to `.plugStream$`', (done) => {
    let store = new TestStore();
    let action = new TestAction();

    store.plugAction(action);
    store.plugStream$.onValue(({event, payload}) => {
      assert(event === 'test');
      assert(payload.key === 'value');
      done();
    });
    action.publish('test', {key : 'value'});
  });

  it('`.getEvent()` & `.subscribeEvent()` provide observable filtered by event name', () => {
    let store = new TestStore();
    let action = new TestAction();

    let spy1 = sinon.spy();
    let spy2 = sinon.spy();
    let arg1 = {test : '1st'};
    let arg2 = {test : '2nd'};

    store.plugAction(action);

    store.subscribe(store.getEvent('event1st'), spy1);
    store.subscribeEvent('event2nd', spy2);

    action.publish('nothing', {test : 'noop'});
    action.publish('event1st', arg1);
    action.publish('event2nd', arg2);

    assert(spy1.withArgs(arg1).calledOnce);
    assert(spy2.withArgs(arg2).calledOnce);
  });

  it('`.unsubscribeAll()` that dispose all subscription', () => {
    let store = new TestStore();
    let action = new TestAction();

    let spy1 = sinon.spy();
    let spy2 = sinon.spy();
    let arg1 = {test : '1st'};
    let arg2 = {test : '2nd'};

    store.plugAction(action);

    store.subscribe(store.getEvent('event1st'), spy1);
    store.subscribe(store.getEvent('event2nd'), spy2);

    action.publish('event1st', arg1);
    action.publish('event2nd', arg2);
    assert(spy1.withArgs(arg1).calledOnce);
    assert(spy2.withArgs(arg2).calledOnce);

    store.unsubscribeAll();

    action.publish('event1st', arg1);
    action.publish('event2nd', arg2);
    assert(spy1.withArgs(arg1).calledOnce);
    assert(spy2.withArgs(arg2).calledOnce);
  });

});
