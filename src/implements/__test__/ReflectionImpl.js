'use strict';

import assert from 'power-assert';
import React from 'react/dist/react-with-addons';
import ReflectionImpl from '../ReflectionImpl';

describe('ReflectionImpl', ()=> {
  it('can get Function.name as ClassName', ()=> {
    class Test { }
    let test = new Test();

    assert(ReflectionImpl.getClassName.apply(test) === 'Test');
  });
});
