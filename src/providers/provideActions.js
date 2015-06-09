'use strict';

import * as assign from 'object-assign';
import ReflectionImpl from '../implements/ReflectionImpl';
import decoratable    from '../utils/decoratable';

/**
 * @param {Component} Component
 * @param {React} React
 * @param {Array<Action>} ActionClasses
 * @returns {ActionsProvider}
 */
function provideActions(Component, React, ActionClasses) {

  /**
   * @class ActionsProvider
   */
  class ActionsProvider extends React.Component {

    /**
     * @type {Object<string, function>}
     */
    static contextTypes = {
      getAction : React.PropTypes.func.isRequired
    };

    /**
     * for react dev-tools
     * @returns {string}
     */
    getDisplayName() {
      return ReflectionImpl.getClassName.apply(this);
    }

    /**
     *
     * @returns {*}
     */
    render() {
      if (!this.context.getAction) {
        throw new Error('The context does not have `getAction`.' +
          'Make sure the ancestral component provides the domain context, use `@provideContext`.');
      }

      let actions = {};
      ActionClasses.reduce((acc, ActionClass) => {
        acc[ActionClass.name] = this.context.getAction(ActionClass);
      }, actions);
      return React.createElement(Component, assign(actions, this.props));
    }
  }

  return ActionsProvider;
}

export default decoratable(provideActions);
