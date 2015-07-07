'use strict';

import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as React from 'react/addons';
import provideSideEffect from '../provideSideEffect';

let { TestUtils } = React.addons;

describe('@provideSideEffect', () => {

  class ShouldFail extends React.Component {
    render() {
      return null;
    }
  }

  class Test extends React.Component {
    static handleSideEffect() { }
    render() {
      return null;
    }
  }

  it('throw error given component does not have `handleSideEffect`', () => {
    assert.throws(() => {
      provideSideEffect(ShouldFail);
    });
  });

  it('should call `handleSideEffect()` with timing of willMount, didUpdate, willUnmount', () => {
    let container = document.createElement('div');

    let TestComponent = provideSideEffect(Test);
    let spy = sinon.spy(Test, 'handleSideEffect');

    let component = React.render(<TestComponent foo="bar" />, container);
    assert(spy.calledOnce);
    assert(spy.args[0][0][0].foo === 'bar');
    assert(TestComponent.mountedInstances.length === 1);

    component.forceUpdate();
    assert(spy.calledTwice);
    assert(spy.args[1][0][0].foo === 'bar');
    assert(TestComponent.mountedInstances.length === 1);

    React.unmountComponentAtNode(container);
    assert(spy.calledThrice);
    assert(spy.args[2][0].length === 0);
    assert(TestComponent.mountedInstances.length === 0);

    spy.restore();
  });

  it('`mountedInstances` is correctly manage and empty after using `dispose()`', () => {

    let TestComponent = provideSideEffect(Test);

    let container1 = document.createElement('div');
    React.render(<TestComponent />, container1);
    assert(TestComponent.mountedInstances.length === 1);

    let container2 = document.createElement('div');
    React.render(<TestComponent />, container2);
    assert(TestComponent.mountedInstances.length === 2);

    let container3 = document.createElement('div');
    React.render(<TestComponent />, container3);
    assert(TestComponent.mountedInstances.length === 3);

    React.unmountComponentAtNode(container1);
    assert(TestComponent.mountedInstances.length === 2);

    TestComponent.dispose();
    assert(TestComponent.mountedInstances.length === 0);

    React.unmountComponentAtNode(container2);
    React.unmountComponentAtNode(container3);
  });

});
