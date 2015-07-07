# Loxe

[![npm version][npm-image]][npm-url] [![build status][circle-image]][circle-url] [![Dependency Status][deps-image]][deps-url]

Flux architecture with FRP library implementation. **Observable is awesome!**

- The main purpose is **mapping the Observables to props** of the component
- Design with a focus on ES6-7.
- Using the [Higher-order Components](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) with [decorator](https://github.com/wycats/javascript-decorators) instead of Mixin.
- To follow the [ES Observable Proposal](https://github.com/zenparsing/es-observable) to the `Subject`.
- Wherever possible, declarative statements should be.

## Installation

Recommend for use browserify, or other CommonJS/ES6 modules resolver.

### Use browserify

To install the `loxe` by NPM.

```shell
npm install --save loxe
```

```javascript
// CommonJS
var Loxe = require('loxe');

// ES6 modules (babel)
import Loxe from 'loxe';
```

```shell
# Loxe depends on React. If you want to separate `react` as other bundle.
browserify index.js -x react -o bundle.js
browserify -r react -o libs.js
```

### Use `<script src="loxe.js">`

`loxe.js` built with browserify-shim. To run the Loxe `window.React` is required.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
<script src="loxe.js"></script>
```

## Usage

### Flux comparison example

- [flux-comparison/loxe at master · ahomu/flux-comparison](https://github.com/ahomu/flux-comparison/tree/master/loxe)

### Minimal Example

`Domain` that manages the `Store` and `Action`. Each feature of Flux provides to `Component`, using the Context feature of the React.

Loxe uses [javascript-decorators](https://github.com/wycats/javascript-decorators) for the component. TypeScript or Babel with `--stage 1` option, use recommended. (As a function `Root = provideContext(Root);` you might also use)

```javascript
import { Domain, Store, Action, Subject } from 'loxe';

class AppDomain extends Domain {
  getObservables() {
    // Object returns that will provide to components, through `@provideObservables`.
    return {
      items$ : this.getStore(AppStore).items$,
      count$ : this.getStore(AppStore).items$.map(a => a.length)
    };
  }
}

class AppAction extends Action {
  addItem(item) {
    // `.publish()` is like a dispatch of the Flux.
    // By event name published here, you can subscribe from the Store. 
    this.publish('ADD_ITEM', item);
  }
}

class AppStore extends Store {
  constructor() {
    super();

    // init data storage property
    this._items = [];

    // create Observable that keep latest value. (like `Rx.BehaviorSubject`)
    this.items$ = Subject.property(this._items);

    // `.plugStream$` is Observable, and `{event: string, payload: any}`
    // will be published from the `Action` will be aggregated.
    // `.subscribeEvent(event, observer)` subscribe to Observable
    // that from plugStream filtered by events.
    this.subscribeEvent('ADD_ITEM', (item) => {
      this._items.push(item);
      this.items$.next(this._items);
    });
  }
}

// Becoming a root Component, `@provideContext` Decorator is required.
// It connects components Tree Root and Flux.
@provideContext()
class Root extends React.Component {
  render() {
    return <Child />;
  }
}

// @provideAction: Inject Action instance to the component props.
// @provideObservables: Value of the Observable will be provided
//                      from the domain mapped to the props.
@provideAction([AppAction])
@provideObservables(observables => ({
  items : observables.items$
}))
class Child extends React.Component {
  addItem() {
    this.props.AppAction.addItems({data: Date.now()});
  }
  render() {
    return (
      <div>
        <button onClick={this.addItem.bind(this)}>add item</button>
        <ul>
          {this.props.items.map(item => <li>{item.data}</li>)}
        </ul>
      </div>
    );
  }
}

const appDomain = new AppDomain();
appDomain.registerAction(new AppAction());
appDomain.registerStore(new AppStore());
appDomain.mountRootComponent(Root, document.getElementById('app'));
```

### Choose FRP library

At first, you **MUST** sets the FRP (_Functional Reactive Programming_) library, used internally by the `Subject`.

```javascript
import Rx from 'rx-lite';
import rxCombineTemplate from 'rx.observable.combinetemplate';
import { Subject } from 'loxe';

Subject.setBuilder(new Subject.RxBuilder(Rx));
Subject.setCombineTemplate(rxCombineTemplate);
```

Supported [Reactive-Extensions/RxJS](https://github.com/Reactive-Extensions/RxJS) and [rpominov/kefir](https://github.com/rpominov/kefir).

```javascript
import Kefir from 'kefir';
import kefirCombineTemplate from 'kefir.combinetemplate';
import { Subject } from 'loxe';

Subject.setBuilder(new Subject.KefirBuilder(Kefir));
Subject.setCombineTemplate(kefirCombineTemplate);
```

**This is a transitional period for the future within fixed on either side.**

## API Reference

- [Action](#action)
- [Domain](#domain)
- [Store](#store)
- [Subject](#subject)
- [Providers](#providers)

### Action

Is the `Action` of the flux. Implements the API from component to use imperative.

#### `eventStream$: Subject`

All events will be published through this stream. During the initialization phase of the `Domain`, is connected with the `Store#plugStream$`.

#### `publish(event: string, payload: any)`

Publish event data. It's a `this.eventStream$.next({event, payload})` an equivalent process.

#### `do(event: string, payload: any)`

Alias of `publish()`.

### Domain

`Domain` that manages the `Store` and `Action`. Each feature of Flux provides to `Component`, using the context of the React.

#### `registerAction(action: Action)`

Register `Action` instance.

#### `registerStore(store: Store)`

Register `Store` instance.

#### `mountRootComponent(root: Component, container: Element)`

Mount root component at node, and connect domain contexts as props. `root` Component should applied `@provideContext` decorator.

#### `getObservables(): object`

This method called '@provideObservables'. You need to maintain their own when returning this object is not cached, so consistently reuses.

```javascript
getObservables() {
  if (!this.observables$) {
    this.observables$ = {
      items$ : this.getStore(Store).items$,
      count$ : this.getStore(Store).items$.map(a => a.length)
    };
  }
  return this.observables$;
}
```

### Store

Is the `Store` of the flux. `Store` some Observable publishes the `Domain`.

#### `plugStream$: Subject`

`plugStream$` is Observable, and `{event: string, payload: any}` will be published from the `Action` will be aggregated.

Without subscribing to it directly, usually using either of the following methods.

#### `getEvent(event: string): Observable`
#### `subscribe(target: Observable, callback: Function)`
#### `subscribeEvent(event: string, callback: Function)`

These methods generate an Observable filtered in any event from the `plugStream$` or, to subscribe to it. Look at the following example.

```javascript
// example
constructor() {
  super();

  // You want to combine multiple events useful 'getEvent()'.
  let foo$ = this.getEvent('foo');
  let bar$ = this.getEvent('bar');
  this.subscribe(foo$.merge(bar$), v => console.log(v));

  // 'subscribeEvent()' useful if you only subscribe to one type of event.
  this.subscribeEvent('baz', v => console.log(v));
}
```

### Subject

Creates an object with both Observable and Observer roles. That object behave like `Rx.BehaviorSubject`, `Bacon.Bus`, and `Kefir.Bus`(deprecated).

Objects that are generated by subject can be used on the function of `next()`. Useful when combining multiple event streams, controlling the UI.

```javascript
componentWillMount() {
  this.clickStream$ = Subject.stream();
  this.clickStream$.subscribe(e => {
    console.log(e); // -> [SyntheticEvent]
  });
}
render() {
  return <button onClick={this.clickStream$}>click me</button>;
}
```

#### `Subject.setBuilder(builder: Rxbuilder|KefirBuilder)`

Set instance of `Subject.RxBuilder` or `Subject.KefirBuilder`. Select FRP library you want to use.

#### `Subject.setCombineTemplate(combineTemplate: Function)`

Set function of [rx.observable.combinetemplate](https://github.com/ahomu/rx.observable.combinetemplate) or [kefir.combinetemplate](https://github.com/ahomu/kefir.combinetemplate). Use when mapping the Observables to prop of the component.

#### `Subject.stream(): Subject`

To create standard `Subject` object. Value issued only after starting to subscribe.

```javascript
let stream$ = Subject.stream();
stream$.next(100);
stream$.subscribe(v => console.log(`Log: ${v}`));
stream$.next(200);

// => Log: 200
```

#### `Subject.property(): Subject`

To create `Subject` object that keeps latest value. Latest value is issued immediately when started to subscribe.

```javascript
let property$ = Subject.property();
property$.next(100);
property$.subscribe(v => console.log(`Log: ${v}`));
property$.next(200);

// => Log: 100
// => Log: 200
```

#### `next(value: any)`

A common interface with the subject. Notifies the subject of a new element in the sequence.

#### `throw(error: Error)`

A common interface with the subject. Notifies the subject that an error has occurred.

#### `return()`

A common interface with the subject. Notifies the subject of the end of the sequence.

### Providers

Providers are implemented as decorators. But also support to normally functional use.

```javascript
// decorators
@provideXyz()
class MyComponent extends React.Component { }

// normally function
class MyComponent extends React.Component { }
MyComponent = provideXyz(MyComponent);
```

#### `@provideContext()`

`@provideContext` provides `getAction()` and `getObservables()` from `props.domain` in the context of the React.Component.

These methods are used in the `@provideAction` or `@provideObservables`, component tree and `Store` and the `Action` is associated.

#### `@provideActions(Actions: Action[])`

Inject Action instance to the component props.

```javascript
@provideActions([FooAction, BarAction])
class MyComponent extends React.Component {
  doFoo() {
    this.props.FooAction.foo();
  }
  doBar() {
    this.props.BarAction.bar();
  }
}
```

#### `@provideObservables(fn: (observables) => templateObj)`

Value of the Observable will be provided from the `Domain` mapped to the `this.props`.

```javascript
@provideObservables(observables => ({
  items    : observables.items$,
  count    : observables.items$.map(items => items.length),
  navigate : {
    current : observables.page$,
    prev    : observables.page$.map(v => v-1),
    next    : observables.page$.map(v => v+1)
  }
}))
class MyComponent extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => <li>{item.name}</li>)}
      </ul>
      <p>count: {this.props.count}</p>
      <p>current: {this.props.navigate.current}</p>
      <p>prev: {this.props.navigate.prev}</p>
      <p>next: {this.props.navigate.next}</p>
    );
  }
}
```

#### `@provideSideEffect()`

Components that use this Decorator is to control the adverse effects of global available props

```javascript
@provideSideEffect()
class MyComponent extends React.Component {
  static handleSideEffect(propsList) {
    let someOneVisible = propsList.some(props => props.isVisible);
    let htmlElement    = document.body.parentNode;
    
    if (someOneVisible) {
      htmlElement.classList.add('is-some-one-visible');
    } else {
      htmlElement.classList.remove('is-some-one-visible');
    }
  }
}
```

## Tests

```
npm install
npm test
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

[npm-image]: https://img.shields.io/npm/v/loxe.svg
[npm-url]: https://npmjs.org/package/loxe
[circle-image]: https://circleci.com/gh/ahomu/Loxe.svg?style=shield&circle-token=a3b5fc6b1535871b1a7371cc7cbac69abd8f3f93
[circle-url]: https://circleci.com/gh/ahomu/Loxe
[deps-image]: https://david-dm.org/ahomu/Loxe.svg
[deps-url]: https://david-dm.org/ahomu/Loxe
