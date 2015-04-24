'use strict';

import React, {PropTypes} from 'react';
import utils from '../utils';
import Domain from './Domain';

/**
 * @class Component
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
    if (observable$ == null) {
      return;
    }
    this._subscriptions.push(observable$.onValue(observer));
  }

  /**
   *
   */
  unsubscribeAll() {
    this._subscriptions.forEach((subscription) => subscription());
    this._subscriptions = [];
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
   * Get Function.name
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
   *
   * @returns {string}
   */
  getClassName() {
    if (!this.constructor.name) {
      this.constructor.name = utils.extractNameFromFunction(this.constructor);
    }

    return this.constructor.name;
  }

}
