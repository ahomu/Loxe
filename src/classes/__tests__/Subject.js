'use strict';

import * as assert from 'power-assert';
import * as Kefir  from 'kefir';
import * as Rx  from 'rx-lite';

import Subject, { KefirBuilder, RxBuilder } from '../Subject';

describe('Subject', ()=> {

  it('Kefir: `.stream()` will create stream', (done) => {
    Subject.setBuilder(new KefirBuilder(Kefir));

    let stream = Subject.stream();
    stream.next(100);
    stream.onValue(i => {
      assert(i === 200);
      stream.throw(300);
    });
    stream.onError(i => {
      assert(i === 300);
      stream.return();
    });
    stream.onEnd(() => {
      done();
    });
    stream.next(200);
  });

  it('Kefir: `.property()` will create stream that keep latest value', (done) => {
    Subject.setBuilder(new KefirBuilder(Kefir));

    let property = Subject.property(100);
    property.onValue(i => {
      assert(i === 100);
      property.throw(300);
    });
    property.onError(i => {
      assert(i === 300);
      property.return();
    });
    property.onEnd(() => {
      done();
    });
  });

  it('Rx: `.stream()` will create stream', (done) => {
    Subject.setBuilder(new RxBuilder(Rx));

    let stream = Subject.stream();
    stream.next(100);
    stream.subscribe(
      (i) => {
        assert(i === 200);
        stream.throw(new Error('300'));
      },
      (err) => {
        assert(err.message === '300');

        let stream2 = Subject.stream();
        stream2.subscribeOnCompleted(() => {
          done();
        });
        stream2.return();
      },
      () => {
        // in Rx, throw Error when immediate stop and no longer call onCompleted
      }
    );
    stream.next(200);
  });

  it('Rx: `.property()` will create stream that keep latest value', (done) => {
    Subject.setBuilder(new RxBuilder(Rx));

    let property = Subject.property();
    property.next(100);

    property.subscribe(
      (i) => {
        assert(i === 100);
        property.throw(new Error('300'));
      },
      (err) => {
        assert(err.message === '300');

        let property2 = Subject.property();
        property2.subscribeOnCompleted(() => {
          done();
        });
        property2.return();
      },
      () => {
        // in Rx, throw Error when immediate stop and no longer call onCompleted
      }
    );
  });

});
