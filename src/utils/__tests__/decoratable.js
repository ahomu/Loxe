'use strict';

import * as assert from 'power-assert';

import decoratable  from '../decoratable';

describe('utils.decoratable', ()=> {

  it('can decorate class', () => {

    function TestFunction(target, a, b) {
      assert(target.name === 'TestClass');
      assert(a === 1);
      assert(b === '2');
      return class DecoratedClass {};
    }

    let decorateTest = decoratable(TestFunction);

    @decorateTest(1, '2')
    class TestClass {}

    assert(Object.getPrototypeOf(new TestClass()).constructor.name === 'DecoratedClass');
  });

});
