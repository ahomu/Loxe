/**
 * Modules in this bundle
 * 
 * loxe:
 *   license: MIT
 *   author: ahomu
 *   version: 0.2.1
 * 
 * object-assign:
 *   license: MIT
 *   author: Sindre Sorhus <sindresorhus@gmail.com>
 *   maintainers: sindresorhus <sindresorhus@gmail.com>
 *   version: 3.0.0
 * 
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Loxe = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function ownEnumerableKeys(obj) {
	var keys = Object.getOwnPropertyNames(obj);

	if (Object.getOwnPropertySymbols) {
		keys = keys.concat(Object.getOwnPropertySymbols(obj));
	}

	return keys.filter(function (key) {
		return propIsEnumerable.call(obj, key);
	});
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = ownEnumerableKeys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Subject = require('./Subject');

var _implementsReflectionImpl = require('../implements/ReflectionImpl');

/**
 * @typedef {Object} ActionData
 * @property {string} key
 * @property {*} value
 */

/**
 * The role of this class is the Flux `Action`.
 * Implements the behavior methods subclasses that inherit from it.
 * `publish` method is executed, and data flows from the `Observable` to `Store`.
 *
 * @class Action
 */

var Action = (function () {

  /**
   * @constructor
   */

  function Action() {
    _classCallCheck(this, Action);

    this.eventStream$ = _Subject['default'].stream();

    this.initialize();
  }

  _createClass(Action, [{
    key: 'initialize',

    /**
     *
     */
    value: function initialize() {}
  }, {
    key: 'publish',

    /**
     * @param {string} eventName
     * @param {*} payload
     */
    value: function publish(eventName, payload) {
      this.eventStream$.push({
        event: eventName,
        payload: payload
      });
    }
  }, {
    key: 'do',

    /**
     * alias of `publish()`
     * @param {string} eventName
     * @param {*} payload
     */
    value: function _do(eventName, payload) {
      return this.publish(eventName, payload);
    }
  }, {
    key: 'getClassName',

    /**
     * @returns {string}
     */
    value: function getClassName() {
      return _implementsReflectionImpl['default'].getClassName.apply(this);
    }
  }]);

  return Action;
})();

exports['default'] = Action;

// implements you want

/**
 * @type {Kefir.Stream<ActionData>}
 * @private
 */

},{"../implements/ReflectionImpl":6,"./Subject":5}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _implementsReflectionImpl = require('../implements/ReflectionImpl');

var _Action = require('./Action');

var _Store = require('./Store');

/**
 * Do not control application data in the domain, asynchronous processing also does not.
 * Application data that all keep in the Store.
 * Asynchronous processing should be implemented as external function.
 *
 * @class Domain
 */

var Domain = (function () {

  /**
   * @constructor
   */

  function Domain() {
    _classCallCheck(this, Domain);

    this.stores = new Map();
    this.actions = new Map();

    this.initialize();
  }

  _createClass(Domain, [{
    key: 'initialize',

    /**
     *
     */
    value: function initialize() {}
  }, {
    key: 'registerAction',

    /**
     * @param {Action} action
     */
    value: function registerAction(action) {
      if (!(action instanceof _Action['default'])) {
        throw new Error('Given instance of ' + action.getClassName() + ' is not Action');
      }

      var ActionClass = Object.getPrototypeOf(action).constructor;
      if (this.actions.has(ActionClass)) {
        throw new Error('' + action.getClassName() + ' already exists in this domain.');
      } else {
        this.actions.set(ActionClass, action);
      }
    }
  }, {
    key: 'getAction',

    /**
     * @param {Function} ActionClass
     * @returns {Action}
     */
    value: function getAction(ActionClass) {
      if (!this.actions.has(ActionClass)) {
        throw new Error('' + ActionClass.constructor.name + ' is not registered as Action.');
      }

      return this.actions.get(ActionClass);
    }
  }, {
    key: 'registerStore',

    /**
     * @param {Store} store
     */
    value: function registerStore(store) {
      if (!(store instanceof _Store['default'])) {
        throw new Error('Given instance of ' + store.getClassName() + ' is not Store');
      }

      var StoreClass = Object.getPrototypeOf(store).constructor;
      if (this.stores.has(StoreClass)) {
        throw new Error('' + store.getClassName() + ' already exists in this domain.');
      } else {
        this.stores.set(StoreClass, store);
      }
    }
  }, {
    key: 'getStore',

    /**
     * @param {Function} StoreClass
     * @returns {Store}
     */
    value: function getStore(StoreClass) {
      if (!this.stores.has(StoreClass)) {
        throw new Error('' + StoreClass.constructor.name + ' is not registered as Store.');
      }

      return this.stores.get(StoreClass);
    }
  }, {
    key: 'subscribeActionObservableFromStore',

    /**
     * All `Store` subscribe to all `Action`'s Observable
     */
    value: function subscribeActionObservableFromStore() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.stores.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var store = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.actions.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var action = _step2.value;

              store.plugAction(action);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'mountRootComponent',

    /**
     * @param {Component} Component
     * @param {Element} mountNode
     * @returns {ReactComponent}
     */
    value: function mountRootComponent(React, Component, mountNode) {
      this.subscribeActionObservableFromStore();
      return React.render(React.createElement(Component, { domain: this }), mountNode);
    }
  }, {
    key: 'getObservables',

    /**
     * `getObservables` method not implemented anything initially.
     * This method will call from the `provideObservables`.
     * Sync the prop component the returned object as a template.
     * Good for most `observables` caching as a property value.
     *
     * @example
     * ```
     * observables = null;
     *
     * getObservables() {
     *   if (!this.observables) {
     *   this.observables = {
     *       update$ : this.getStore(AppStore).items$
     *     };
     *   }
     *
     *   return this.observables;
     * }
     * ```
     *
     * @returns {Object<string, Rx.Observable>}
     */
    value: function getObservables() {
      throw new Error(this.getClassName() + ':`getObservables` is abstract method.' + 'You should implements in sub-class');
    }
  }, {
    key: 'getClassName',

    /**
     * @returns {string}
     */
    value: function getClassName() {
      return _implementsReflectionImpl['default'].getClassName.apply(this);
    }
  }]);

  return Domain;
})();

exports['default'] = Domain;

/**
 * @type {Map<Function, Store>}
 */

/**
 * @type {Map<Function, Action>}
 */

// implements you want

},{"../implements/ReflectionImpl":6,"./Action":2,"./Store":4}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Subject = require('./Subject');

var _implementsReflectionImpl = require('../implements/ReflectionImpl');

var _implementsSubscriberImpl = require('../implements/SubscriberImpl');

/**
 * The role of this class is the Flux `Store`.
 * Subscribe the anonymous Observable provided the Action.
 * Itself has any Observable to expose Domain property.
 *
 * @example
 * ```
 * import {Store, Subject} from 'loxe';
 *
 * export default class AppStore extends Store {
 *   _items = [];
 *   items$ = Subject.property([]);
 *   initialize() {
 *     this.subscribe('ADD_ITEM', (item) => {
 *       this._items.unshift(item);
 *       this.items$.push(this._items);
 *     });
 *   }
 * }
 * ```
 *
 * @class Store
 */

var Store = (function () {

  /**
   * @constructor
   */

  function Store() {
    _classCallCheck(this, Store);

    this.plugStream$ = _Subject['default'].stream();

    this.initialize();
  }

  _createClass(Store, [{
    key: 'initialize',

    /**
     *
     */
    value: function initialize() {}
  }, {
    key: 'plugAction',

    /**
     *
     * @param {Action} action
     */
    value: function plugAction(action) {
      this.subscribe(action.eventStream$, this.plugStream$.push.bind(this.plugStream$));
    }
  }, {
    key: 'getEvent',

    /**
     *
     * @param {string} eventName
     * @returns {Rx.Observable<*>}
     */
    value: function getEvent(eventName) {
      return this.plugStream$.filter(function (_ref) {
        var event = _ref.event;
        return event === eventName;
      }).map(function (_ref2) {
        var payload = _ref2.payload;
        return payload;
      });
    }
  }, {
    key: 'subscribeEvent',

    /**
     * @param {string} eventName
     * @param {Function} observer
     */
    value: function subscribeEvent(eventName, observer) {
      this.subscribe(this.getEvent(eventName), observer);
    }
  }, {
    key: 'subscribe',

    /**
     * Delegate to `SubscriberImpl.subscribe()`
     * Subscribe to if the first argument is a string, it filtered as the event name.
     *
     * @param {string|Rx.Observable<ActionData>} observable$
     * @param {function} observer
     */
    value: function subscribe(observable$, observer) {
      if (typeof observable$ === 'string') {
        observable$ = this.getEvent(observable$);
      }
      _implementsSubscriberImpl['default'].subscribe.apply(this, [observable$, observer]);
    }
  }, {
    key: 'unsubscribeAll',

    /**
     * Delegate to `SubscriberImpl.unsubscribeAll()`
     */
    value: function unsubscribeAll() {
      _implementsSubscriberImpl['default'].unsubscribeAll.apply(this);
    }
  }, {
    key: 'getClassName',

    /**
     * @returns {string}
     */
    value: function getClassName() {
      return _implementsReflectionImpl['default'].getClassName.apply(this);
    }
  }]);

  return Store;
})();

exports['default'] = Store;

/**
 *
 * @type {Kefir.Stream<ActionData>}
 * @private
 */

// implements you want

},{"../implements/ReflectionImpl":6,"../implements/SubscriberImpl":7,"./Subject":5}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var RxSubjectBuilder = (function () {

  /**
   * @constructor
   * @param {Rx} Rx
   */

  function RxSubjectBuilder(Rx) {
    _classCallCheck(this, RxSubjectBuilder);

    this.MyRx = null;

    this.MyRx = Rx;
  }

  _createClass(RxSubjectBuilder, [{
    key: 'stream',

    /**
     * Subject for `Component` ui events & `Action` publish events.
     *
     * @returns {Rx.Subject}
     */
    value: function stream() {
      return this.create(this.MyRx.Subject);
    }
  }, {
    key: 'property',

    /**
     * Subject for `Store` data property.
     * Even when starting to subscribe to retained latest value will be published.
     *
     * @param {*} initialValue
     * @returns {Rx.BehaviorSubject}
     */
    value: function property(initialValue) {
      return this.create(this.MyRx.BehaviorSubject, initialValue);
    }
  }, {
    key: 'create',

    /**
     * @param {Rx.Subject} BaseClass
     * @param {*} [initialValue]
     * @returns {Rx.Subject}
     */
    value: function create(BaseClass, initialValue) {

      function _subject() {
        _subject.onNext.apply(_subject, arguments);
      }

      for (var key in BaseClass.prototype) {
        _subject[key] = BaseClass.prototype[key];
      }

      _subject.push = _subject.onNext;
      _subject.error = _subject.onError;
      _subject.end = _subject.onCompleted;

      BaseClass.call(_subject, initialValue);

      return _subject;
    }
  }]);

  return RxSubjectBuilder;
})();

exports.RxSubjectBuilder = RxSubjectBuilder;

var KefirSubjectBuilder = (function () {

  /**
   * @constructor
   * @param {Kefir} Kefir
   */

  function KefirSubjectBuilder(Kefir) {
    _classCallCheck(this, KefirSubjectBuilder);

    this.MyKefir = null;

    this.MyKefir = Kefir;
  }

  _createClass(KefirSubjectBuilder, [{
    key: 'stream',

    /**
     * Subject for `Component` ui events & `Action` publish events.
     *
     * @returns {Kefir.Stream}
     */
    value: function stream() {
      return this.create(this.MyKefir.Stream);
    }
  }, {
    key: 'property',

    /**
     * Subject for `Store` data property.
     * Even when starting to subscribe to retained latest value will be published.
     *
     * @param {*} initialValue
     * @returns {Kefir.Observable}
     */
    value: function property(initialValue) {
      return this.create(this.MyKefir.Property, initialValue);
    }
  }, {
    key: 'create',

    /**
     * @param {Kefir.Stream} BaseClass
     * @param {*} [initialValue]
     * @returns {Observable}
     */
    value: function create(BaseClass, initialValue) {

      function _subject() {
        _subject._emitValue.apply(_subject, arguments);
      }

      for (var key in BaseClass.prototype) {
        _subject[key] = BaseClass.prototype[key];
      }

      _subject.push = _subject._emitValue;
      _subject.error = _subject._emitError;
      _subject.end = _subject._emitEnd;

      BaseClass.call(_subject);

      if (initialValue !== undefined) {
        _subject._active = true;
        _subject._currentEvent = { type: 'value', value: initialValue, current: true };
      }

      return _subject;
    }
  }]);

  return KefirSubjectBuilder;
})();

exports.KefirSubjectBuilder = KefirSubjectBuilder;

/**
 * @class Subject
 */

var Subject = (function () {
  function Subject() {
    _classCallCheck(this, Subject);
  }

  _createClass(Subject, null, [{
    key: 'stream',

    /**
     * @returns {Observable}
     */
    value: function stream() {
      return Subject.builder.stream.apply(Subject.builder, arguments);
    }
  }, {
    key: 'property',

    /**
     * @param {*} initialValue
     * @returns {Observable}
     */
    value: function property() {
      return Subject.builder.property.apply(Subject.builder, arguments);
    }
  }, {
    key: 'combineTemplate',

    /**
     * @param {Object} templateObject
     * @returns {Observable}
     */
    value: function combineTemplate() {
      return Subject.combineTemplate.apply(Subject.combineTemplate, arguments);
    }
  }, {
    key: 'setBuilder',

    /**
     * @param {RxSubjectBuilder|KefirSubjectBuilder} builderInstance
     */
    value: function setBuilder(builderInstance) {
      Subject.builder = builderInstance;
    }
  }, {
    key: 'setCombineTemplate',

    /**
     * @param {Function} combineTemplateFn
     */
    value: function setCombineTemplate(combineTemplateFn) {
      Subject.combineTemplate = combineTemplateFn;
    }
  }]);

  return Subject;
})();

exports['default'] = Subject;

/**
 * @type {Rx}
 */

/**
 * @type {Kefir}
 */

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * @class ReflectionImpl
 */

var ReflectionImpl = (function () {
  function ReflectionImpl() {
    _classCallCheck(this, ReflectionImpl);
  }

  _createClass(ReflectionImpl, null, [{
    key: 'getClassName',

    /**
     * Get `Function#name`
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
     *
     * @returns {string}
     */
    value: function getClassName() {
      // < IE9 is not support `Object.getPrototypeOf`
      return Object.getPrototypeOf(this).constructor.name;
    }
  }]);

  return ReflectionImpl;
})();

exports['default'] = ReflectionImpl;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * @class SubscriberImpl
 */

var SubscriberImpl = (function () {
  function SubscriberImpl() {
    _classCallCheck(this, SubscriberImpl);

    this._subscriptions = [];
  }

  _createClass(SubscriberImpl, null, [{
    key: 'subscribe',

    /**
     * Subscribe to observable, that holds the subscription.
     * Become a memory leak if you subscribe using this method,
     * the end of instance lifecycle manually subscription must discard.
     *
     * @param {Observable} observable$
     * @param {function} observer
     */
    value: function subscribe(observable$, observer) {

      if (observable$ == null) {
        return;
      }

      var subscription = undefined;
      if (observable$.subscribe) {
        // Rx
        subscription = observable$.subscribe(observer);
      } else {
        // Bacon, Kefir
        observable$.onValue(observer);
        subscription = [observable$, observer];
      }

      this._subscriptions = this._subscriptions || [];
      this._subscriptions.push(subscription);
    }
  }, {
    key: 'unsubscribeAll',

    /**
     * To discard all subscriptions of the observable.
     */
    value: function unsubscribeAll() {
      this._subscriptions = this._subscriptions || [];

      this._subscriptions.forEach(function (subscription) {
        if (subscription.dispose) {
          // Rx
          subscription.dispose();
        } else {
          // Bacon, Kefir
          subscription[0].offValue(subscription[1]);
        }
      });
      this._subscriptions = [];
    }
  }]);

  return SubscriberImpl;
})();

exports['default'] = SubscriberImpl;

/**
 * @type {Array<Subscription>}
 */

},{}],8:[function(require,module,exports){
'use strict';

var _classesAction = require('./classes/Action');

var _classesDomain = require('./classes/Domain');

var _classesStore = require('./classes/Store');

var _classesSubject = require('./classes/Subject');

var _providersProvideContext = require('./providers/provideContext');

var _providersProvideObservables = require('./providers/provideObservables');

var _providersProvideActions = require('./providers/provideActions');

exports.Action = _classesAction['default'];
exports.Domain = _classesDomain['default'];
exports.Store = _classesStore['default'];
exports.Subject = _classesSubject['default'];
exports.provideActions = _providersProvideActions['default'];
exports.provideContext = _providersProvideContext['default'];
exports.provideObservables = _providersProvideObservables['default'];

},{"./classes/Action":2,"./classes/Domain":3,"./classes/Store":4,"./classes/Subject":5,"./providers/provideActions":9,"./providers/provideContext":10,"./providers/provideObservables":11}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = (window.React);

var React = _react;

var _objectAssign = require('object-assign');

var assign = _objectAssign;

var _implementsReflectionImpl = require('../implements/ReflectionImpl');

var _utilsDecoratable = require('../utils/decoratable');

/**
 * @param {Component} Component
 * @param {Array<Action>} ActionClasses
 * @returns {ActionsProvider}
 */
function provideActions(Component, ActionClasses) {

  /**
   * @class ActionsProvider
   */

  var ActionsProvider = (function (_React$Component) {
    function ActionsProvider() {
      _classCallCheck(this, ActionsProvider);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(ActionsProvider, _React$Component);

    _createClass(ActionsProvider, [{
      key: 'getDisplayName',

      /**
       * for react dev-tools
       * @returns {string}
       */
      value: function getDisplayName() {
        return _implementsReflectionImpl['default'].getClassName.apply(this);
      }
    }, {
      key: 'render',

      /**
       *
       * @returns {*}
       */
      value: function render() {
        var _this = this;

        if (!this.context.getAction) {
          throw new Error('The context does not have `getAction`.' + 'Make sure the ancestral component provides the domain context, use `@provideContext`.');
        }

        var actions = {};
        ActionClasses.reduce(function (acc, ActionClass) {
          acc[ActionClass.name] = _this.context.getAction(ActionClass);
        }, actions);
        return React.createElement(Component, assign(actions, this.props));
      }
    }], [{
      key: '_originalComponent',

      /**
       * @type {Component}
       * @private
       */
      value: Component,
      enumerable: true
    }, {
      key: 'contextTypes',

      /**
       * @type {Object<string, function>}
       */
      value: {
        getAction: React.PropTypes.func.isRequired
      },
      enumerable: true
    }]);

    return ActionsProvider;
  })(React.Component);

  return ActionsProvider;
}

exports['default'] = (0, _utilsDecoratable['default'])(provideActions);

},{"../implements/ReflectionImpl":6,"../utils/decoratable":12,"object-assign":1}],10:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = (window.React);

var React = _react;

var _classesDomain = require('../classes/Domain');

var _implementsReflectionImpl = require('../implements/ReflectionImpl');

var _utilsDecoratable = require('../utils/decoratable');

/**
 * @param {Component} Component
 * @returns {ContextProvider}
 */
function provideContext(Component) {

  /**
   * @class ContextProvider
   */

  var ContextProvider = (function (_React$Component) {
    function ContextProvider() {
      _classCallCheck(this, ContextProvider);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }

      this.childContexts = null;
    }

    _inherits(ContextProvider, _React$Component);

    _createClass(ContextProvider, [{
      key: 'componentWillMount',

      /**
       *
       */
      value: function componentWillMount() {
        if (!this.props.domain) {
          throw new Error('@provideContext higher-ordered component must have `props.domain`');
        }
        this.childContexts = {
          getAction: this.props.domain.getAction.bind(this.props.domain),
          getObservables: this.props.domain.getObservables.bind(this.props.domain)
        };
      }
    }, {
      key: 'getDisplayName',

      /**
       * for react dev-tools
       * @returns {string}
       */
      value: function getDisplayName() {
        return _implementsReflectionImpl['default'].getClassName.apply(this);
      }
    }, {
      key: 'getChildContext',

      /**
       * @returns {Object<string, function>}
       */
      value: function getChildContext() {
        return this.childContexts;
      }
    }, {
      key: 'render',

      /**
       * @returns {ReactElement}
       */
      value: function render() {
        return React.createElement(Component, this.props);
      }
    }], [{
      key: '_originalComponent',

      /**
       * @type {Component}
       * @private
       */
      value: Component,
      enumerable: true
    }, {
      key: 'propTypes',

      /**
       * @type {Object<string, function>}
       */
      value: {
        domain: React.PropTypes.instanceOf(_classesDomain['default']).isRequired
      },
      enumerable: true
    }, {
      key: 'childContextTypes',

      /**
       * @type {Object<string, function>}
       */
      value: {
        getAction: React.PropTypes.func.isRequired,
        getObservables: React.PropTypes.func.isRequired
      },
      enumerable: true
    }]);

    return ContextProvider;
  })(React.Component);

  return ContextProvider;
}

exports['default'] = (0, _utilsDecoratable['default'])(provideContext);

/**
 * @type {Object<string, function>}
 */

},{"../classes/Domain":3,"../implements/ReflectionImpl":6,"../utils/decoratable":12}],11:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = (window.React);

var React = _react;

var _objectAssign = require('object-assign');

var assign = _objectAssign;

var _classesSubject = require('../classes/Subject');

var _implementsSubscriberImpl = require('../implements/SubscriberImpl');

var _implementsReflectionImpl = require('../implements/ReflectionImpl');

var _utilsDecoratable = require('../utils/decoratable');

/**
 * @param {Component} Component
 * @param {Function} receiveObservablesHandler
 * @returns {ActionsProvider}
 */
function provideObservables(Component, receiveObservablesHandler) {

  /**
   * @class ObservablesProvider
   */

  var ObservablesProvider = (function (_React$Component) {
    function ObservablesProvider() {
      _classCallCheck(this, ObservablesProvider);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(ObservablesProvider, _React$Component);

    _createClass(ObservablesProvider, [{
      key: 'subscribe',

      /**
       * Delegate to `SubscriberImpl.subscribe()`
       *
       * @param {Observable} observable$
       * @param {function} observer
       */
      value: function subscribe(observable$, observer) {
        _implementsSubscriberImpl['default'].subscribe.apply(this, [observable$, observer]);
      }
    }, {
      key: 'unsubscribeAll',

      /**
       * Delegate to `SubscriberImpl.unsubscribeAll()`
       */
      value: function unsubscribeAll() {
        _implementsSubscriberImpl['default'].unsubscribeAll.apply(this);
      }
    }, {
      key: 'getDisplayName',

      /**
       * for react dev-tools
       * @returns {string}
       */
      value: function getDisplayName() {
        return _implementsReflectionImpl['default'].getClassName.apply(this);
      }
    }, {
      key: 'componentWillMount',

      /**
       *
       */
      value: function componentWillMount() {
        if (!this.context.getObservables) {
          throw new Error('The context does not have `getObservables`.' + 'Make sure the ancestral component provides the domain context, use `@provideContext`.');
        }

        var observables = this.context.getObservables();
        var stateObject = receiveObservablesHandler(observables);

        var combined = _classesSubject['default'].combineTemplate(stateObject);
        this.subscribe(combined, this.setState.bind(this));
      }
    }, {
      key: 'componentWillUnmount',

      /**
       * To notify that the component unmounted to the domain.
       */
      value: function componentWillUnmount() {
        this.unsubscribeAll();
      }
    }, {
      key: 'render',

      /**
       * Values that from Observables are saved in `state`.
       * Delegate to components within props.
       *
       * @returns {*}
       */
      value: function render() {
        return React.createElement(Component, assign({}, this.props, this.state));
      }
    }], [{
      key: '_originalComponent',

      /**
       * @type {Component}
       * @private
       */
      value: Component,
      enumerable: true
    }, {
      key: 'contextTypes',

      /**
       * @type {Object<string, function>}
       */
      value: {
        getObservables: React.PropTypes.func.isRequired
      },
      enumerable: true
    }]);

    return ObservablesProvider;
  })(React.Component);

  return ObservablesProvider;
}

exports['default'] = (0, _utilsDecoratable['default'])(provideObservables);

},{"../classes/Subject":5,"../implements/ReflectionImpl":6,"../implements/SubscriberImpl":7,"../utils/decoratable":12,"object-assign":1}],12:[function(require,module,exports){
'use strict';

exports['default'] = decoratable;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

/**
 * can be used as decorators
 * Main purpose the higher-order component to use as a Decorator.
 *
 * https://github.com/wycats/javascript-decorators
 *
 * ```
 *   let decoratableSubject = decoratable(subject);
 *   @decoratableSubject(foo, bar, baz)
 *   class AcmeClass {
 *     // acme implements
 *   }
 *
 *   // same as below
 *
 *   class AcmeClass {
 *     // acme implements
 *   }
 *   subject(AcmeClass, foo, bar, baz);
 * ```
 *
 * @param {Function} subjectFunc
 */

function decoratable(subjectFunc) {
  return function () {
    for (var _len = arguments.length, initialArgs = Array(_len), _key = 0; _key < _len; _key++) {
      initialArgs[_key] = arguments[_key];
    }

    // Decorator
    if (initialArgs.length < subjectFunc.length) {
      var _ret = (function () {
        var diff = subjectFunc.length - initialArgs.length;

        return {
          v: function decorateWrapper() {
            for (var _len2 = arguments.length, targetKeyDescriptor = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              targetKeyDescriptor[_key2] = arguments[_key2];
            }

            return subjectFunc.apply(null, [].concat(_toConsumableArray(targetKeyDescriptor.slice(0, diff)), initialArgs));
          }
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    }

    // Normally
    return subjectFunc.apply(null, initialArgs);
  };
}

},{}]},{},[8])(8)
});