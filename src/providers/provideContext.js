'use strict';

import * as React  from 'react';
import Domain from '../classes/Domain';
import ReflectionImpl from '../implements/ReflectionImpl';
import copyStatics    from '../utils/copy-statics';
import decoratable    from '../utils/decoratable';

/**
 * @param {Component} Component
 * @returns {ContextProvider}
 */
function provideContext(Component) {

  /**
   * @class ContextProvider
   */
  class ContextProvider extends React.Component {
    /**
     * @type {Component}
     * @private
     */
    static _originalComponent = Component;

    /**
     * @type {Object<string, function>}
     */
    static propTypes = {
      domain : React.PropTypes.instanceOf(Domain).isRequired
    };

    /**
     * @type {Object<string, function>}
     */
    static childContextTypes = {
      getAction      : React.PropTypes.func.isRequired,
      getObservables : React.PropTypes.func.isRequired
    };

    /**
     * @type {Object<string, function>}
     */
    childContexts = null;

    /**
     *
     */
    componentWillMount() {
      if (!this.props.domain) {
        throw new Error('@provideContext higher-ordered component must have `props.domain`');
      }
      this.childContexts = {
        getAction      : this.props.domain.getAction.bind(this.props.domain),
        getObservables : this.props.domain.getObservables.bind(this.props.domain)
      };
    }

    /**
     * for react dev-tools
     * @returns {string}
     */
    getDisplayName() {
      return ReflectionImpl.getClassName.apply(this);
    }

    /**
     * @returns {Object<string, function>}
     */
    getChildContext() {
      return this.childContexts;
    }

    /**
     * @returns {ReactElement}
     */
    render() {
      return React.createElement(Component, this.props);
    }
  }

  copyStatics(Component, ContextProvider);

  return ContextProvider;
}

export default decoratable(provideContext);
