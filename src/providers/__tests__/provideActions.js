'use strict';

import * as assert from 'power-assert';
import * as React  from 'react/addons';

import Action  from '../../classes/Action';
import Domain  from '../../classes/Domain';

import provideActions from '../provideActions';
import provideContext from '../provideContext';

let TestUtils = React.addons.TestUtils;

describe('@provideActions', ()=> {

  class TestDomain extends Domain {}
  class TestAction extends Action {}

  @provideActions([TestAction])
  class ChildComponent extends React.Component {
    render() {
      return <div />;
    }
  }

  @provideContext()
  class RootComponent extends React.Component {
    render() {
      return <ChildComponent />;
    }
  }

  it('@provideAction', () => {
    let domain = new TestDomain();
    let action = new TestAction();
    let container = document.createElement('div');

    domain.registerAction(action);
    let root = domain.mountRootComponent(React, RootComponent, container);
    let child = TestUtils.findRenderedComponentWithType(root, ChildComponent);
    let innerWrapped = TestUtils.findRenderedComponentWithType(root, ChildComponent._originalComponent);

    assert(child.context.getAction(TestAction) === action);
    assert(innerWrapped.props.TestAction === action);

    React.unmountComponentAtNode(container);
  });

});
