'use strict';

import * as assert from 'power-assert';
import * as React  from 'react/addons';

import Action  from '../../classes/Action';
import Domain  from '../../classes/Domain';

import provideContext from '../provideContext';

let TestUtils = React.addons.TestUtils;

describe('@provideContext', ()=> {

  class TestDomain extends Domain {}
  class TestAction extends Action {}

  class ChildComponent extends React.Component {
    static contextTypes = {
      getAction      : React.PropTypes.func.isRequired,
      getObservables : React.PropTypes.func.isRequired
    };

    render() {
      return <GrandChildComponent />;
    }
  }

  class GrandChildComponent extends React.Component {
    static contextTypes = {
      getObservables : React.PropTypes.func.isRequired
    };

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

  it('root context inherit to child', () => {
    let domain = new TestDomain();
    let action = new TestAction();

    let container = document.createElement('div');

    domain.registerAction(action);
    let root = domain.mountRootComponent(React, RootComponent, container);
    let child = TestUtils.findRenderedComponentWithType(root, ChildComponent);

    assert(React.PropTypes.func.isRequired(child.context.getAction));
    assert(React.PropTypes.func.isRequired(child.context.getObservables));
    assert(child.context.getAction(TestAction) === action);

    let grandChild = TestUtils.findRenderedComponentWithType(child, GrandChildComponent);
    assert(grandChild.context.getAction == null);
    assert(React.PropTypes.func.isRequired(grandChild.context.getObservables));

    React.unmountComponentAtNode(container);
  });

  it('throw error @provideContext specified component does not have `props.domain`', () => {
    let container = document.createElement('div');

    assert.throws(() => {
      React.render(React.createElement(RootComponent), container);
    }, Error);

    React.unmountComponentAtNode(container);
  });

});
