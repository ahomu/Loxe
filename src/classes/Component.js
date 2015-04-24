'use strict';

import React, {PropTypes} from 'react';
import utils from '../utils';
import Domain from './Domain';
import SubscriberImpl from '../implements/SubscriberImpl';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * @class Component
 * @implements SubscriberImpl
 */
export default class Component extends React.Component {

  /**
   * @type {Object<string, function>}
   */
  static childContextTypes = {
    $ : PropTypes.instanceOf(Domain)
  };

  /**
   * @type {Object<string, function>}
   */
  static contextTypes = {
    $ : PropTypes.instanceOf(Domain)
  };

  /**
   * @type {Object<string, function>}
   */
  static propTypes = {
    domain : PropTypes.instanceOf(Domain)
  };

  /**
   * @type {Object<string, Observable>}
   */
  observables = {};

  /**
   * @type {Array<Subscription>}
   */
  _subscriptions = [];

  /**
   * @param {Observable} observable$
   * @param {function} observer
   */
  subscribe(observable$, observer) {
    SubscriberImpl.subscribe.apply(this, [observable$, observer]);
  }

  /**
   *
   */
  unsubscribeAll() {
    SubscriberImpl.unsubscribeAll.apply(this, arguments);
  }

  /**
   * @returns {Object<string, *>}
   */
  getChildContext() {
    return {
      $ : this.getDomain()
    };
  }

  /**
   * @returns {Domain}
   */
  getDomain() {
    // child components has `this.context.$`, root component has `this.props.domain`
    return (this.context && this.context.$) || this.props.domain || null;
  }

  /**
   * shorthand of observable.emit/push
   * @param {String} observableName
   * @param {*} value
   */
  publish(observableName, value) {
    this.observables[observableName].emit(value);
  }

  /**
   *
   */
  componentWillMount() {
    this.componentWillReceiveObservables(this.getDomain().observables);
  }

  /**
   *
   */
  componentDidMount() {
    this.getDomain().onReceiveComponentDidMount(this);
  }

  /**
   *
   */
  componentWillUnmount() {
    this.getDomain().onReceiveComponentWillUnmount(this);
    this.unsubscribeAll();
  }

  /**
   * must be implement
   * @param {Object<string, Observables>} observables
   */
  componentWillReceiveObservables() {
    //
  }

  /**
   * must be implement
   */
  render() {
    return <div />;
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return ReflectionImpl.getClassName.apply(this);
  }

}
