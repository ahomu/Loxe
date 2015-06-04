'use strict';

import * as React from 'react';
import * as assign from 'object-assign';
import ReflectionImpl from '../implements/ReflectionImpl';
import decoratable    from '../utils/decoratable';

/**
 * @param {Component} Component
 * @param {Array<Action>} ActionClasses
 * @returns {ActionsProvider}
 */
function provideActions(Component, ActionClasses = []) {

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
      let intents = {};
      ActionClasses.reduce((acc, ActionClass) => {
        acc[ActionClass.name] = this.context.getAction(ActionClass);
      }, intents);
      return React.createElement(Component, assign(intents, this.props, this.state));
    }
  }

  return ActionsProvider;
}

export default decoratable(provideActions);
