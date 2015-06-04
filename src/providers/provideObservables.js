'use strict';

import * as React from 'react';
import * as rxCombineTemplate from 'rx.observable.combinetemplate';
import * as assign from 'object-assign';
import SubscriberImpl from '../implements/SubscriberImpl';
import ReflectionImpl from '../implements/ReflectionImpl';
import decoratable    from '../utils/decoratable';

/**
 * @param {Component} Component
 * @param {Function} receiveObservablesHandler
 * @returns {ActionsProvider}
 */
function provideObservables(Component, receiveObservablesHandler) {

  class ObservablesProvider extends React.Component {

    /**
     * @type {Object<string, function>}
     */
    static contextTypes = {
      getObservables : React.PropTypes.func.isRequired
    };

    /**
     * Delegate to `SubscriberImpl.subscribe()`
     *
     * @param {Observable} observable$
     * @param {function} observer
     */
    subscribe(observable$, observer) {
      SubscriberImpl.subscribe.apply(this, [observable$, observer]);
    }

    /**
     * Delegate to `SubscriberImpl.unsubscribeAll()`
     */
    unsubscribeAll() {
      SubscriberImpl.unsubscribeAll.apply(this);
    }

    /**
     * for react dev-tools
     * @returns {string}
     */
    getDisplayName() {
      return ReflectionImpl.getClassName.apply(this);
    }

    /**
     *
     */
    componentWillMount() {
      if (!this.context.getObservables) {
        throw new Error('The context does not have `getObservables`.' +
          'Make sure the ancestral component provides the domain context.');
      }

      let observables = this.context.getObservables();
      let stateObject = receiveObservablesHandler(observables);

      this.subscribe(rxCombineTemplate(stateObject), this.setState.bind(this));
    }

    /**
     * To notify that the component unmounted to the domain.
     */
    componentWillUnmount() {
      this.unsubscribeAll();
    }

    /**
     * Values that from Observables are saved in `state`.
     * Delegate to components within props.
     *
     * @returns {*}
     */
    render() {
      return React.createElement(Component, assign({}, this.props, this.state));
    }
  }

  return ObservablesProvider;
}

export default decoratable(provideObservables);
