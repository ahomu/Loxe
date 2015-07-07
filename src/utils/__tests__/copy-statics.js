'use strict';

import * as assert from 'power-assert';

import copyStatics  from '../copy-statics';

describe('utils.copyStatics', ()=> {

  it('copy static methods & properties reference', () => {

    class TestClass {
      static foo() { }
      bar() { }
      static baz = {};
      static qux = 'testest';
    }

    let expectTo = {};
    copyStatics(TestClass, expectTo);

    assert(expectTo.foo === TestClass.foo);
    assert(expectTo.bar == null);
    assert(expectTo.baz === TestClass.baz);
    assert(expectTo.qux === TestClass.qux);
  });

});
