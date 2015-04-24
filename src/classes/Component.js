'use strict';

import React, {PropTypes} from 'react';
import Domain from './Domain';
import SubscriberImpl from '../implements/SubscriberImpl';
import ReflectionImpl from '../implements/ReflectionImpl';

/**
 * The Base Component class with Domain reference within the `this.context`.
 * Domain context are inherited automatically to child components.
 *
 * Received the `observables` of the Domain, available for `componentWillReceiveObservables`.
 * Component itself `observables`, Intent to use.
 *
 * TODO Future 'React.Component' not need to. mixin or impl class ?
 *
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
   * Observables itself.
   *
   * @type {Object<string, Observable>}
   */
  observables = {};

  /**
   * Subscriptions for observable of domain.
   *
   * @type {Array<Subscription>}
   */
  _subscriptions = [];

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
   * Child components has `this.context.$`, root component has `this.props.domain`._subscriptions
   *
   * @returns {Domain}
   */
  getDomain() {
    return (this.context && this.context.$) || this.props.domain || null;
  }

  /**
   * shorthand of observable.emit/push
   *
   * ```
   * this.publish(ComponentEvents.checkout$, this.state.products);
   * ```
   *
   * @param {String} observableName
   * @param {*} value
   */
  publish(observableName, value) {
    this.observables[observableName].emit(value);
  }

  /**
   * Start subscribe to Observable of the domain.
   */
  componentWillMount() {
    this.componentWillReceiveObservables(this.getDomain().observables);
  }

  /**
   * To notify that the component mounted to the domain.
   */
  componentDidMount() {
    this.getDomain().onReceiveComponentDidMount(this);
  }

  /**
   * To notify that the component unmounted to the domain.
   */
  componentWillUnmount() {
    this.getDomain().onReceiveComponentWillUnmount(this);
    this.unsubscribeAll();
  }

  /**
   * Implement this method in a subclass, you handle the Observables.
   *
   * ```
   * componentWillReceiveObservables(observables) {
   *     this.subscribe(Bacon.combineTemplate({
   *         products : observables[DomainEvents.cartProducts$],
   *         total    : observables[DomainEvents.cartTotal$].map((v) => v + '')
   *     }), this.setState.bind(this));
   * }
   * ```
   *
   * @abstract
   * @param {Object<string, Observables>} observables
   */
  componentWillReceiveObservables() {
    // implement...
  }

  /**
   * render :)
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
