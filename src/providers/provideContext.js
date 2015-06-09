'use strict';

import Domain from '../classes/Domain';
import ReflectionImpl from '../implements/ReflectionImpl';
import decoratable    from '../utils/decoratable';

/**
 * @param {Component} Component
 * @param {React} React
 * @returns {ContextProvider}
 */
function provideContext(Component, React) {

  /**
   * @class ContextProvider
   */
  class ContextProvider extends React.Component {
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

  return ContextProvider;
}

export default decoratable(provideContext);
