'use strict';

import * as assert from 'power-assert';

import ReflectionImpl from '../ReflectionImpl';

describe('ReflectionImpl', ()=> {
  it('can get Function.name as ClassName', ()=> {
    class Test { }
    let test = new Test();

    assert(ReflectionImpl.getClassName.apply(test) === 'Test');
  });
});
