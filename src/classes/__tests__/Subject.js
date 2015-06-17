'use strict';

import * as assert from 'power-assert';
import * as Kefir  from 'kefir';
import * as Rx  from 'rx-lite';

import Subject, { KefirSubjectBuilder, RxSubjectBuilder } from '../Subject';

describe('Subject', ()=> {

  it('Kefir: `.stream()` will create stream', (done) => {
    Subject.setBuilder(new KefirSubjectBuilder(Kefir));

    let stream = Subject.stream();
    stream.push(100);
    stream.onValue(i => {
      assert(i === 200);
      stream.error(300);
    });
    stream.onError(i => {
      assert(i === 300);
      stream.end();
    });
    stream.onEnd(() => {
      done();
    });
    stream.push(200);
  });

  it('Kefir: `.property()` will create stream that keep latest value', (done) => {
    Subject.setBuilder(new KefirSubjectBuilder(Kefir));

    let property = Subject.property(100);
    property.onValue(i => {
      assert(i === 100);
      property.error(300);
    });
    property.onError(i => {
      assert(i === 300);
      property.end();
    });
    property.onEnd(() => {
      done();
    });
  });

  it('Rx: `.stream()` will create stream', (done) => {
    Subject.setBuilder(new RxSubjectBuilder(Rx));

    let stream = Subject.stream();
    stream.push(100);
    stream.subscribe(
      (i) => {
        assert(i === 200);
        stream.error(new Error('300'));
      },
      (err) => {
        assert(err.message === '300');

        let stream2 = Subject.stream();
        stream2.subscribeOnCompleted(() => {
          done();
        });
        stream2.end();
      },
      () => {
        // in Rx, throw Error when immediate stop and no longer call onCompleted
      }
    );
    stream.push(200);
  });

  it('Rx: `.property()` will create stream that keep latest value', (done) => {
    Subject.setBuilder(new RxSubjectBuilder(Rx));

    let property = Subject.property();
    property.push(100);

    property.subscribe(
      (i) => {
        assert(i === 100);
        property.error(new Error('300'));
      },
      (err) => {
        assert(err.message === '300');

        let property2 = Subject.property();
        property2.subscribeOnCompleted(() => {
          done();
        });
        property2.end();
      },
      () => {
        // in Rx, throw Error when immediate stop and no longer call onCompleted
      }
    );
  });

});
