'use strict';

import * as React from 'react';
import * as shallowequal from 'shallowequal';

import ReflectionImpl from '../implements/ReflectionImpl';
import copyStatics    from '../utils/copy-statics';
import decoratable    from '../utils/decoratable';

/**
 * Components that use this Decorator is to control the adverse effects of global available props
 * inspired https://github.com/gaearon/react-side-effect
 *
 * @class SideEffectProvider
 */
function provideSideEffect(Component) {

  if (typeof Component.handleSideEffect !== 'function') {
    throw new Error(`Given component ${Component.constructor.name} don't have static method 'handleSideEffect()'.`);
  }

  class SideEffectProvider extends React.Component {

    static mountedInstances = [];

    static emitChange() {
      Component.handleSideEffect(SideEffectProvider.mountedInstances.map(instance => instance.props));
    }

    static dispose() {
      SideEffectProvider.mountedInstances = [];
      SideEffectProvider.emitChange();
    }

    /**
     * for react dev-tools
     * @returns {string}
     */
    getDisplayName() {
      return ReflectionImpl.getClassName.apply(this);
    }

    componentWillMount() {
      SideEffectProvider.mountedInstances.push(this);
      SideEffectProvider.emitChange();
    }

    shouldComponentUpdate(nextProps) {
      return !shallowequal(nextProps, this.props);
    }

    componentDidUpdate() {
      SideEffectProvider.emitChange();
    }

    componentWillUnmount() {
      const index = SideEffectProvider.mountedInstances.indexOf(this);
      SideEffectProvider.mountedInstances.splice(index, 1);
      SideEffectProvider.emitChange();
    }

    render() {
      return (
        <Component {...this.props} />
      );
    }
  }

  copyStatics(Component, SideEffectProvider);

  return SideEffectProvider;
}

export default decoratable(provideSideEffect);
