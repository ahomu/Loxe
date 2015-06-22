'use strict';

import * as assert from 'power-assert';
import * as Kefir  from 'kefir';

import Action  from '../Action';
import Subject, { KefirSubjectBuilder } from '../Subject';

Subject.setBuilder(new KefirSubjectBuilder(Kefir));

describe('Action', ()=> {

  class TestAction extends Action {
    someAction() {
      this.publish('test', {key : 'value'});
    }
  }

  it('can `.publish()` data', (done) => {
    let testAction = new TestAction();

    testAction.eventStream$.onValue((data) => {
      assert(data.event === 'test');
      assert(data.payload.key === 'value');
      done();
    });

    testAction.someAction();
  });

});
