'use strict';

import * as assert from 'power-assert';

import Subject from '../Subject';

describe('Subject', ()=> {

  it('`.stream()` will create stream', (done) => {
    let stream = Subject.stream();
    stream.push(100);
    stream.onValue(i => {
      assert(i === 200);
      stream.error(300);
    });
    stream.onError(i => {
      assert(i === 300);
      stream.end(400);
    });
    stream.onEnd(() => {
      done();
    });
    stream.push(200);
  });

  it('`.property()` will create stream that keep latest value', (done) => {
    let property = Subject.property(100);
    property.onValue(i => {
      assert(i === 100);
      property.error(300);
    });
    property.onError(i => {
      assert(i === 300);
      property.end(400);
    });
    property.onEnd(() => {
      done();
    });
  });

});
